<template>
  <map></map>
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

<style scoped>
page{
  height: 100%rpx;
  width:100%rpx;
}
</style>
