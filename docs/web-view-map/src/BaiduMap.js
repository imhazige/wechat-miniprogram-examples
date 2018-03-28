import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import {Flex,FlexItem,Button} from 'react-weui';
//import styles
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import './map.css'

function appendScript(src, callback) {
    const script = document.createElement("script");

    //同步加载
    script.async = false;
    script.onload = callback;
    script.src = src;
    document.body.appendChild(script);
}

function doInitMap() {
    //脚本就绪
    //初始化地图
    let BMap = window.BMap;
    var map = new BMap.Map("map_container");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);

    var traffic = new BMap.TrafficLayer();        // 创建交通流量图层实例      
    // map.addTileLayer(traffic);  

    demoLushu(map);


    return;
}

var lushu;

function demoLushu(map){
        //路书示例参见
    //view-source:http://api.map.baidu.com/library/LuShu/1.2/examples/LuShu.html
    //http://lbsyun.baidu.com/jsdemo.htm#c2_8 
    //http://lbsyun.baidu.com/index.php?title=open/library
    map.enableScrollWheelZoom();
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 13);
    
    // 实例化一个驾车导航用来生成路线
    var drv = new BMap.DrivingRoute('北京', {
        onSearchComplete: function (res) {
            if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
                var arrPois = res.getPlan(0).getRoute(0).getPath();

                var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                    scale: 0.6,//图标缩放大小
                    strokeColor: '#fff',//设置矢量图标的线填充颜色
                    strokeWeight: '2',//设置线宽
                });
                var icons = new BMap.IconSequence(sy, '10', '30');
                var polyline = new BMap.Polyline(arrPois, {
                    enableEditing: false,//是否启用线编辑，默认为false
                    enableClicking: true,//是否响应点击事件，默认为true
                    icons: [icons],
                    strokeWeight: '8',//折线的宽度，以像素为单位
                    strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
                    strokeColor: "#18a45b" //折线颜色
                });
            
                map.addOverlay(polyline);          //增加折线

                // map.addOverlay(new BMap.Polyline(arrPois, { strokeColor: '#111' }));
                map.setViewport(arrPois);

                lushu = new BMapLib.LuShu(map, arrPois, {
                    defaultContent: "",//"从天安门到百度大厦"
                    autoView: true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                    icon: new BMap.Icon('http://api.map.baidu.com/library/LuShu/1.2/examples/car.png', new BMap.Size(52, 26), { anchor: new BMap.Size(27, 13) }),
                    speed: 4500,
                    enableRotation: true,//是否设置marker随着道路的走向进行旋转
                    landmarkPois: [
                        { lng: 116.314782, lat: 39.913508, html: '加油站', pauseTime: 2 },
                        { lng: 116.315391, lat: 39.964429, html: '高速公路收费<div><img src="http://map.baidu.com/img/logo-map.gif"/></div>', pauseTime: 3 },
                        { lng: 116.381476, lat: 39.974073, html: '肯德基早餐<div><img src="http://ishouji.baidu.com/resource/images/map/show_pic04.gif"/></div>', pauseTime: 2 }
                    ]
                });

                lushu.start();
            }
        }
    });
    drv.search('天安门', '百度大厦');

}

function initMap() {
    doInitMap();
    return;
    //添加百度script并解析ak参数
    var url_string = window.location.href;
    var url = new URL(url_string);
    var ak = url.searchParams.get("ak");
    console.log('ak is ' + ak);

    //百度的脚本直接append会有问题，因为其调用了document.write,这里直接拷贝
    //<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=您的密钥"></script>
    //里的内容来加载
    window.BMap_loadScriptTime = (new Date).getTime();
    //这种方式也不行,虽然加载了，但是初始化不全
    appendScript('http://api.map.baidu.com/api?v=2.0&ak=' + ak, function () {
        //脚本就绪
        //初始化地图
        doInitMap();
    });
}

const wx = window.wx;
wx.miniProgram.getEnv(function (res) {
    console.log('wx env', res.miniprogram) // true })   
    //postMessage并不能马上传递给小程序，这种交互方式不方便
    wx.miniProgram.postMessage({ data: { foo: 'first message' } });
});

class BaiduMap extends Component {
    componentDidMount() {
        console.log('---loaded..'); // true })    
        initMap();
    }
    onClick(){
        wx.miniProgram.postMessage({ data: { foo: 'bar' } });
        wx.miniProgram.navigateTo({url: '/pages/index/index'})
    }
    onAgainClick(){
        lushu &&  lushu.stop();
        lushu &&  lushu.start();
    }
    render() {
        console.log('---renderes.'); // true })    
        return (
            <div className="element-full-size">
                <div id="map_container"></div>
                <Flex >
                    <FlexItem>
                    <Button size="small" onClick={this.onClick}>返回</Button>
                    </FlexItem>
                    <FlexItem>
                    <Button  size="small" type="default" onClick={this.onAgainClick}>再来一遍</Button>
                    </FlexItem>
                </Flex>    
            </div>
        );
    }
}

export default BaiduMap;

