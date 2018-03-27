import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Button } from 'react-weui';
//import styles
import 'weui';
import 'react-weui/build/packages/react-weui.css';

const wx = window.wx;
wx.miniProgram.getEnv(function (res) {
    console.log('wx env', res.miniprogram) // true })   
    
    
    wx.miniProgram.postMessage({ data: { foo: 'first message' } });
});

class BaiduMap extends Component {
    componentDidMount() {
        console.log('---loaded..'); // true })    
        
    }
    onClick(){
        wx.miniProgram.postMessage({ data: { foo: 'bar' } });
        wx.miniProgram.navigateTo({url: '/pages/index/index'})
    }
    render() {
        console.log('---renderes.'); // true })    
        return (
        <Button onClick={this.onClick}>------</Button>
        );
    }
}

export default BaiduMap;

