<template>
  <div class="my-container">
      <web-view @message="onMessage" :src="url"></web-view>
  </div>
</template>

<script>
import async from "async";
import log from "@/utils/log";
import baiduApi from "@/utils/baiduApi";
import keys from '@/key.js'

// let url = 'https://imhazige.github.io/wechat-miniprogram-examples/web-view-map/build/index.html?ak=' + keys.baiduAppKey;
let url = 'http://localhost:3000?ak=' + keys.baiduAppKey;
log.info('url is ' + url);

export default {
  data() {
    return {
      url:url,
      // url: 'http://localhost:4000/index.html#wechat_redirect'
    };
  },

  components: {},

  methods: {
    onMessage: function(e) {
      log.info("on Message", e);
    }
  },
  mounted() {
     log.info("mounted");
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
