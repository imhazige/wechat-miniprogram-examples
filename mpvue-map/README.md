# mpvue-map

mpvue工具创建的微信小程序地图相关的示例

## 构建步骤

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## 示例说明

### 移动气泡
使用baidu webapi规划线路，使用polyline画出路线
使用translateMarker移动marker附带callout,label，但是目前(基础库版本1.9.93)translateMarker有如下问题
- rotate并没有按照设置的值来(直接设置marker的rotate是正常的)
- 莫名其妙的消失又出现(似乎是当rotate=0时会消失)
- autoRotate=true的角度也是莫名其妙
- 如果有polyline在行进线路上，则会导致rotate不起作用,没有任何效果

### WebView组件
测试时需要将选项“不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书”打开

#### 开发运行
进入/docs/web-view-map目录  
按照所在目录README.md描述启动项目  
本目录下npm run dev  
使用小程序开发工具打开本目录  
