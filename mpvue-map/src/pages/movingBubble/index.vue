<template>
  <div class="my-container">
      <map id="map" class='map' :markers="markers" :controls="controls" @controltap="onControltap"  @regionchange="onMapRegionchange" @end="onMapRegionchange" @start="onMapRegionchange">
          <cover-view class="time"  :style="popStyle">{{popMsg}}</cover-view>
      </map>
  </div>
</template>

<script>
import async from "async";
import log from "../../utils/log";

export default {
  data() {
    return {
      popStyle: "some",
      motto: "Hello World",
      userInfo: {},
      markers: [],
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
      popMsg: "init"
    };
  },

  components: {},

  methods: {
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
      log.debug("control tap....", this.mapCtx);
      this.randomPos();
    },

    randomPos: function(stamp) {
      const that = this;
      // TODO 随机地图范围内上的两个点
      let pos1 = null;
      let pos2 = null;

      async.waterfall(
        [
          // function(callback) {
          //    //TODO 获得点对应的地理位置
          //   baidu
          //     .reverseGeo({
          //       latitude: 0,
          //       longitude: 0
          //     })
          //     .then(res => {
          //       if (stamp != this.requestTimeStamp) {
          //         log.info("忽略过期请求", stamp, this.requestTimeStamp);
          //         return;
          //       }
          //       let data = res.data;
          //       if (data.status) {
          //         log.info("error status " + data.status);
          //         return;
          //       }
          //       // console.log('data' , data);
          //       log.info(data.result.sematic_description);
          //     });
          // },
          function(callback) {
            log.debug("1--------------");
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

                log.debug("随机点", pos1, pos2);

                that.markers = [
                  {
                    iconPath: "/static/imgs/icon_location.png",
                    latitude: pos1.latitude,
                    longitude: pos1.longitude
                  },
                  {
                    iconPath: "/static/imgs/icon_location.png",
                    latitude: pos2.latitude,
                    longitude: pos2.longitude
                  }
                ];
                callback(null, res);
              },
              fail: err => {
                log.error(err);
              }
            });
          },
          function(arg1, callback) {
            // arg1 now equals 'one' and arg2 now equals 'two'
            callback(null, "three");
          },
          function(arg1, callback) {
            // arg1 now equals 'three'
            callback(null, "done");
          }
        ],
        function(err, result) {
          // result now equals 'done'
          if (err) {
          }
          log.info("---" + result);
        }
      );

      // TODO 路线规划
      // TODO 开始按路线行进
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
/* 起作用 -- page */
body {
  height: 100%;
  width: 100%;
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
