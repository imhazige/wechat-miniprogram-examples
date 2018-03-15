// pages/movingPopup/movingPopup.js
import keys from '../../key';
import baidu from '../../utils/baiduApi'
import async from '../../utils/async.min.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    popMsg: 'init',
    controls: [{
      id: 1,
      iconPath: '/imgs/ic_controls.png',
      position: {
        left: 0,
        top: 200
      },
      clickable: true
    }]
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
    // this.setData({
    //   popStyle: '----'
    // });
    async.waterfall([
      function (callback) {
        callback(null, 'one', 'two');
      },
      function (arg1, arg2, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        callback(null, 'three');
      },
      function (arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
      }
    ], function (err, result) {
      // result now equals 'done'
      console.log('---' + result);
    });

  },

  onControltap: function () {
    //重新生成路径
    this.requestTimeStamp = new Date();
    randomPos(this.requestTimeStamp);
  },

  requestTimeStamp: null,

  randomPos: function (stamp) {
    //TODO 随机地图范围内上的两个点
    let pos1 = null;
    let pos2 = null;

    // async.waterfall
    //TODO 获得点对应的地理位置
    //获得屏幕区域
    this.mapCtx.getRegion({
      success: (res) => {

      }
    });

    //TODO 路线规划

    //TODO 开始按路线行进

    baidu.reverseGeo({
      latitude: 0,
      longitude: 0
    }).then((res) => {
      if (stamp != this.requestTimeStamp) {
        console.info('忽略过期请求', stamp, this.requestTimeStamp);
        return;
      }
      let data = res.data;
      if (data.status) {
        console.log('error status ' + data.status);
        return;
      }
      // console.log('data' , data);
      console.log(data.result.sematic_description);
    });
  },

  relocate: function () {

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