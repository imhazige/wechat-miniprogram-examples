import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Button } from 'react-weui';
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
    return;
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
    render() {
        console.log('---renderes.'); // true })    
        return (
            <div className="element-full-size">
                <div id="map_container"></div>
                <Button onClick={this.onClick}>返回</Button>
            </div>
        );
    }
}

export default BaiduMap;

