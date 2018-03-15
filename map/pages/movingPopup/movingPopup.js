// pages/movingPopup/movingPopup.js
import keys from '../../key';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    popMsg: 'init'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.mapCtx = wx.createMapContext('map', this.context);
    this.setData({
      // longtitude:30,
      // latitude:30,
      popStyle: ''
    });
  },

  requestTimeStamp:null,

  randomPos:function(stamp){
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/',
      mathod:'GET',
      data:{
        ak: keys.baiduAppKey,
        output:'json',
        location: res.latitude + ',' + res.longitude,
        coordtype:'gcj02ll'
      },
      success: (res) => {
        let data = res.data;
        if (data.status){
          console.log('error status ' + data.status);
          return;
        }
        // console.log('data' , data);
        console.log(data.result.sematic_description);
      },
    });
  },

  regeoLoc:function(){
    
  },

  onMapRegionchange: function () {
    if (e.type !== "end") {
      this.requestTimeStamp = new Date();
      return;
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})