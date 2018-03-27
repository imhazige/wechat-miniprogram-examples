import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Button } from 'react-weui';
//import styles
import 'weui';
import 'react-weui/build/packages/react-weui.css';

const wx = window.wx;

class BaiduMap extends Component {
    componentDidMount() {
        console.log('---loaded..'); // true })    
        if (wx) {
            wx.miniProgram.postMessage({ data: { foo: 'bar' } })
            wx.miniProgram.getEnv(function (res) {
                console.log('wx env', res.miniprogram) // true })    
            });
        }
    }
    render() {
        console.log('---renderes.'); // true })    
        return (
        <Button>------</Button>
        );
    }
}

export default BaiduMap;

