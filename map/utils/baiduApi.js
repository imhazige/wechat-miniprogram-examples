module.exports = {
    reverseGeo: function (ops) {

        return new Promise(function(resolve, reject){
            wx.request({
                url: 'https://api.map.baidu.com/geocoder/v2/',
                mathod: 'GET',
                data: {
                    ak: keys.baiduAppKey,
                    output: 'json',
                    location: ops.latitude + ',' + ops.longitude,
                    coordtype: 'gcj02ll'
                },
                success: (res) => {
                    
                }
            });
        });
    }
}