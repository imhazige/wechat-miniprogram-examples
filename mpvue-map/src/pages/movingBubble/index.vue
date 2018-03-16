<template>
  <div class="container my-container">
      <map id="map" class="map"></map>
  </div>
</template>

<script>
export default {
  data() {
    return {
      motto: "Hello World",
      userInfo: {}
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
    }
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
