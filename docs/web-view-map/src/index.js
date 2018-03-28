import React from 'react';
import ReactDOM from 'react-dom';
import BaiduMap from './BaiduMap'

const render = (ops) => {
    // console.debug(ops);
    window.initConfig = ops;
    ReactDOM.render(
        <BaiduMap />,
        document.getElementById('root')
    );
    return;
    let pageModule = 'BaiduMap';
    //为便于github pages发布，此处不要使用动态加载
    import(/* webpackChunkName: `${pageModule}` */ `./${pageModule}`).then((m)=>{
        let PageTag = m.default;
        ReactDOM.render(
            <PageTag />,
            document.getElementById('root')
        );
    }).catch(error => console.log('An error occurred while loading the component',error));
};

render({});