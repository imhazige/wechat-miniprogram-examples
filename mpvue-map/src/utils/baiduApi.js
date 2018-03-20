import keys from '@/key'

export default {
  reverseGeo: function (ops) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: "https://api.map.baidu.com/geocoder/v2/",
        mathod: "GET",
        data: {
          ak: keys.baiduAppKey,
          output: "json",
          location: ops.latitude + "," + ops.longitude,
          coordtype: "gcj02ll"
        },
        success: function () {}
      });
    });
  },
  planRoute: function (ops) {
    let data = {
      ...ops,
      ak: keys.baiduAppKey,
      ret_coordtype: 'gcj02',
      coord_type: 'gcj02'
    };
    return new Promise(function (resolve, reject) {
      wx.request({
        url: "https://api.map.baidu.com/direction/v2/driving",
        mathod: "GET",
        data: data,
        success: res => {
          resolve(res);
        },
        fail: res => {
          reject(res);
        }
      });
    });
  }
}
