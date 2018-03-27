import React from 'react';
import ReactDOM from 'react-dom';

const render = (ops) => {
    // console.debug(ops);
    window.initConfig = ops;

    let pageModule = 'BaiduMap';

    import(/* webpackChunkName: `${pageModule}` */ `./${pageModule}`).then((m)=>{
        let PageTag = m.default;
        ReactDOM.render(
            <PageTag />,
            document.getElementById('root')
        );
    }).catch(error => console.log('An error occurred while loading the component',error));
};

render({});