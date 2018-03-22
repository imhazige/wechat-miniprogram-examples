<template>
  <div class="my-container">
      <map id="map" class='map' show-location :polyline="polyline" :markers="markers" :controls="controls" @controltap="onControltap"  @regionchange="onMapRegionchange" @end="onMapRegionchange" @start="onMapRegionchange">
          <cover-view class="cover-view-car2" :style="car2viewStyle">
            <cover-view class="cover-view-car2-popup"  :style="popStyle">{{popMsg}}</cover-view>
            <cover-image src="/static/imgs/car.png" class="cover-view-car2-img"  :style="car2Style"></cover-image>
          </cover-view>
          <cover-view class="map-btn-clear" @tap="onBtnClearTap">清空</cover-view>
      </map>
  </div>
</template>

<script>
import async from "async";
import log from "@/utils/log";
import baiduApi from "@/utils/baiduApi";

export default {
  data() {
    return {
      car2viewStyle: "",
      popStyle: "",
      popMsg: "some",
      car2Style: "",
      motto: "Hello World",
      polyline: null,
      userInfo: {},
      markers: null,
      markerCar: null,
      stopwaterfall: null,
      controls: [
        {
          id: 1,
          iconPath: "/static/imgs/ic_controls.png",
          position: {
            left: 0,
            top: 200
            // width:2000,
            // height:200
          },

          clickable: true
        }
      ],
      popMsg: "这是一个CoverView"
    };
  },

  components: {},

  methods: {
    onBtnClearTap: function() {
      this.markers = null;
      this.stopwaterfall = true;
    },
    getUserInfo() {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              this.userInfo = res.userInfo;
            }
          });
        }
      });
    },
    onControltap: function(e) {
      const that = this;
      log.debug("control tap....", this.mapCtx);
      that.stopwaterfall = true;
      async.nextTick(this.randomPos);
      // this.randomPos();
    },
    caculateRotate: function(from, to) {
      //中国区在东经北纬，可当作x,y座标系计算,但是要依据api,rotate转换成顺时针值
      //这个经测试适合全球所有区域
      let x = to.longitude - from.longitude;
      let y = to.latitude - from.latitude;

      let degrees = Math.atan2(x, y);

      degrees = degrees * 180 / Math.PI;

      return degrees;
    },
    /**
     *
     */
    buildSteps: function(startPos, res) {
      let routes = res.data.result.routes[0];
      let steps = routes.steps;
      // let fromPos = startPos;
      //直接传入steps,会产生直接跳跃的情况，详细的分段才是贴近实际的道路
      // steps.map(item => {
      //   let tempPoints = item.path.split(";");
      //   tempPoints.map(tempPoint => {
      //     let point = tempPoint.split(",");
      //     let p = {
      //       longitude: parseFloat(point[0]),
      //       latitude: parseFloat(point[1])
      //     };
      //     let p2 = {
      //       start_location:item.start_location
      //     };
      //     allpoints.push(item);
      //   });
      // });
      //path里包含的更详细的分段信息，路况就基于这个分段
      let allpoints = [];
      let fromPos = startPos;
      steps.map(item => {
        let tempPoints = item.path.split(";");
        tempPoints.map(tempPoint => {
          let point = tempPoint.split(",");
          let to = {
            longitude: parseFloat(point[0]),
            latitude: parseFloat(point[1])
          };
          let p = {
            parentStep: item,
            from: fromPos,
            to: to
          };
          fromPos = to;
          allpoints.push(p);
        });
      });
      return allpoints;
    },
    /**
     * 计算地图座标对应地图上的屏幕座标
     * 不可行，暂时没想到精确的方法，顶多获得百分比
     */
    geo2MapXY: function(mapContext, pos) {
      return { x: "50%", y: "50%" };
    },
    createMoveCoverViewFunctions: function(mapCtx, startPos, res) {
      const that = this;
      let allpoints = that.buildSteps(startPos, res);

      log.info("开始移动汽车2");
      function move(stepItem, next) {
        let rotateV = that.caculateRotate(stepItem.from, stepItem.to);
        //TODO 计算地图座标对应地图上的屏幕座标
        let fromXY = that.geo2MapXY(mapCtx,stepItem.from);
        let toXY = that.geo2MapXY(mapCtx,stepItem.to);
        //TODO 渐进动画
        that.car2viewStyle = `left:${toXY.x};top:${toXY.y};`;
        //TODO 移动屏幕的处理

        next();
      }

      let moveFuncs = allpoints.map(item => {
        return function func(callback) {
          move(item, callback);
        };
      });

      return moveFuncs;
    },
    createMoveFunctions: function(mapCtx, markerId, startPos, res) {
      const that = this;
      let allpoints = that.buildSteps(startPos, res);

      log.info("开始移动汽车1");
      function move(stepItem, next) {
        let rotateV = that.caculateRotate(stepItem.from, stepItem.to);
        log.info(
          "移向",
          stepItem.from,
          stepItem.to,
          rotateV,
          stepItem.parentStep
        );
        log.info(`角度值${rotateV}`);

        //尝试直接设置rotate,显示是正常的,这种方法导致刷新频繁闪烁,实际效果很不好
        // setTimeout(function() {
        //   that.markerCar.rotate = rotateV;
        //   next(null);
        // }, 300);

        //计算的角度正确，但是translateMarker方法问题较多:
        // 1:rotate并没有按照设置的值来(直接设置marker的rotate是正常的)
        // 2:莫名其妙的消失又出现(似乎是当rotate=0时会消失)
        // 3: autoRotate=true的角度也是莫名其妙
        // 4:如果有polyline在行进线路上，则会导致rotate不起作用,没有任何效果
        // 5:如果中途清空markers,则此函数不再起作用
        try {
          mapCtx.translateMarker({
            markerId: markerId,
            destination: stepItem.to,
            rotate: rotateV,
            autoRotate: false,
            // duration: 5000,
            animationEnd: () => {
              log.info("end...");
              next(that.stopwaterfall);
            },
            fail: err => {
              log.error("移动汽车错误", err);
              // throw new Error(err);
              next(err, null);
            }
          });
        } catch (err) {
          next(err);
        }
      }

      log.info("allpoints...", allpoints);

      let moveFuncs = allpoints.map(item => {
        return function func(callback) {
          move(item, callback);
        };
      });

      return moveFuncs;
    },
    randomPos: function(stamp) {
      const that = this;
      //随机地图范围内上的两个点
      let pos1 = null;
      let pos2 = null;
      let pos1_ = null;
      let pos2_ = null;
      that.stopwaterfall = null;

      async.waterfall(
        [
          function(callback) {
            // log.debug("1--------------");
            // 获得屏幕区域
            that.mapCtx.getRegion({
              success: function(res) {
                // {southwest, northeast}
                log.debug("getRegion", res);
                let longitudeScope =
                  res.northeast.longitude - res.southwest.longitude;
                let latitudeScope =
                  res.northeast.latitude - res.southwest.latitude;

                pos1 = {
                  longitude:
                    res.southwest.longitude + Math.random() * longitudeScope,
                  latitude:
                    res.southwest.latitude + Math.random() * latitudeScope
                };
                pos2 = {
                  longitude:
                    res.southwest.longitude + Math.random() * longitudeScope,
                  latitude:
                    res.southwest.latitude + Math.random() * latitudeScope
                };

                pos1_ = {
                  longitude:
                    res.southwest.longitude + Math.random() * longitudeScope,
                  latitude:
                    res.southwest.latitude + Math.random() * latitudeScope
                };
                pos2_ = {
                  longitude:
                    res.southwest.longitude + Math.random() * longitudeScope,
                  latitude:
                    res.southwest.latitude + Math.random() * latitudeScope
                };

                let degree = that.caculateRotate(pos1, pos2);
                log.debug("rotate", degree);
                log.debug("随机点", pos1, pos2);

                that.markerCar = {
                  id: 1,
                  iconPath: "/static/imgs/car.png",
                  latitude: pos1.latitude,
                  longitude: pos1.longitude,
                  width: 25,
                  height: 25,
                  rotate: degree,
                  callout: {
                    borderRadius: 5,
                    bgColor: "#ccc",
                    display: "ALWAYS",
                    content: `<a href="http://baidu.com">汽车1 callout</a>`
                  },
                  label: {
                    // fontSize:26,
                    content: '<a href="http://baidu.com">汽车1 callout</a>'
                  }
                };

                that.markers = [
                  {
                    iconPath: "/static/imgs/icon_location.png",
                    latitude: pos1.latitude,
                    longitude: pos1.longitude,
                    width: 25,
                    height: 30
                  },
                  {
                    //不要使用字符串作为id,按照文档应该使用number
                    id: "sss",
                    iconPath: "/static/imgs/icon_location.png",
                    latitude: pos2.latitude,
                    longitude: pos2.longitude,
                    width: 25,
                    height: 30
                  },
                  that.markerCar
                ];
                //计划线路
                baiduApi
                  .planRoute({
                    origin: pos1_.latitude + "," + pos1_.longitude,
                    destination: pos2_.latitude + "," + pos2_.longitude
                  })
                  .then(res => {
                    log.debug("完成计划线路", res);
                    let routes = that.parsePolyLine(res.data);
                    //使用了polyline,translateMarker方法的rotate就不起作用
                    // log.info('======',JSON.stringify(routes.splice(0,3)));
                    that.polyline = routes;

                    callback(null, res);
                  })
                  .catch(err => {
                    callback(err);
                  });
              },
              fail: err => {
                log.error(err);
              }
            });
          },
          function(res, callback) {
            log.info('开始路线2');
            //使用coverView移动示例
            //移动汽车2
            let moveFuncs = that.createMoveCoverViewFunctions(
              that.mapCtx,
              pos1_,
              res
            );
            async.waterfall(moveFuncs, (err, result) => {
              log.info("汽车2移动结束。", err);
            });
            callback(null);
          },
          function(callback) {
            // log.info('线路一已被注释');
            // callback(null, "done");
            // return;
            //移动汽车1
            //在有polyline的路径上移动rotate不起作用
            // let moveFuncs = that.createMoveFunctions(that.mapCtx, 1, pos1_, res);
            // async.waterfall(moveFuncs, (err, result) => {
            //   log.info("汽车1移动结束。", err);
            // });
            // callback(null, "three");
            // return;
            baiduApi
              .planRoute({
                origin: pos1.latitude + "," + pos1.longitude,
                destination: pos2.latitude + "," + pos2.longitude
              })
              .then(res => {
                log.debug("完成计划线路2", res);

                //移动汽车1
                let moveFuncs = that.createMoveFunctions(
                  that.mapCtx,
                  1,
                  pos1,
                  res
                );
                async.waterfall(moveFuncs, (err, result) => {
                  log.info("汽车1移动结束。", err);
                  callback(null, "three");
                });
              })
              .catch(err => {
                callback(err);
              });
          },
          function(arg1, callback) {
            // arg1 now equals 'three'
            callback(null, "done");
            // that.markerCar.rotate = 30;
          }
        ],
        function(err, result) {
          // result now equals 'done'
          if (err) {
          }
          log.info("waterfall done", err);
        }
      );
    },

    parsePolyLine: function(data) {
      let routes = data.result.routes[0];
      let steps = routes.steps;

      let nnps = [];
      let ployLine = steps.map(item => {
        let tempPoints = item.path.split(";");
        let points = tempPoints.map(tempPoint => {
          let point = tempPoint.split(",");
          let res = {
            lng: point[0],
            lat: point[1]
          };
          // let res = lngLatUtil.bdmapToMapabcEncryt(point[0], point[1]);
          return {
            longitude: res.lng,
            latitude: res.lat
          };
        });

        let cppoints = [...points];
        //后两位是Alpha(?)%,如果要100，则设置为空字符串
        let alpha = "90";
        let borderColor = "#BC0909";
        //边框宽度实际效果总是很大，不知为何？
        // let borderWidth = 0.00001;
        let borderWidth = 0;
        let lineWidth = 10;

        let traffics = item.traffic_condition.map(tempPoint => {
          // sum += tempPoint.geo_cnt;
          //不支持命名颜色

          let color = "#cccccc" + alpha;
          if (1 == tempPoint.status) {
            color = "#00ff00" + alpha;
          } else if (2 == tempPoint.status) {
            color = "#0000ff" + alpha;
          } else if (3 == tempPoint.status) {
            color = "#e69138" + alpha;
          } else if (4 == tempPoint.status) {
            color = "#cc0000" + alpha;
          }
          nnps.push({
            points: points.splice(0, tempPoint.geo_cnt),
            // points: points,
            color: color,
            width: lineWidth,
            borderWidth: borderWidth,
            arrowLine: true,
            borderColor: borderColor
          });
        });

        //添加整段去掉实时路况中间间隔
        nnps.unshift({
          points: cppoints,
          color: "#cccccc" + alpha,
          width: lineWidth,
          borderWidth: borderWidth,
          arrowLine: true,
          borderColor: borderColor
        });

        return {
          points: cppoints,
          color: "#0091ff" + alpha,
          width: lineWidth,
          borderWidth: borderWidth,
          arrowLine: true,
          borderColor: borderColor
        };
      });

      log.info("polyline1", ployLine);
      log.info("polyline2", nnps);

      return nnps;
    },

    relocate: function() {},

    onMapRegionchange: function(e) {
      log.debug("onMapRegionchange");
      if (e.type !== "end") {
        this.requestTimeStamp = new Date();
        return;
      }
    }
  },
  mounted() {
    this.mapCtx = wx.createMapContext("map", this.context);
  },
  created() {}
};
</script>

<style>
/* 全局变量不起作用 */
:root {
  --g-c-v: blue;
}
/* 起作用 -- page */
body {
  /* 大小必须要rpx，否则不起作用 */
  --carimg-width: 55rpx;
  --g-c-v: blue;
  height: 100%;
  width: 100%;
}
.map-btn-clear {
  position: absolute;
  top: 60%;
  left: 0;
  background-color: var(--g-c-v);
}
.cover-view-car2 {
  position: absolute;
}
.cover-view-car2-img {
  width: var(--carimg-width);
}
.time {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  line-height: 50px;
  height: 30rpx;
  width: 30rpx;
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
<style scoped>
/* 不起作用 -- page */
body {
  height: 100%;
  width: 100%;
}
</style>
<style>
.map {
  height: 80%;
  width: 100%;
}
.my-container {
  height: 100%;
  width: 100%;
}
</style>
