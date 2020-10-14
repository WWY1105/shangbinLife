const util = require('./util.js')
const md5 = require('./md5.js')
//MD5加密
const getUrl = function (url, para = {}) {
  const app = getApp();
  //origin
  url += "?";
  const password = "037925fa578c4ed98885d7b28ade5462";
  let j = JSON.parse(JSON.stringify(para)); //param's json
  j.timestamp = (new Date).getTime();
  let key_json = Object.keys(j);
  key_json.sort();
  let encode_str = "";
  for (let h in key_json) {
    encode_str += key_json[h] + "=" + j[key_json[h]];
    url += key_json[h] + "=" + j[key_json[h]] + "&";
  }
  let i = md5.hexMD5(encode_str + password),
    m = "";
  for (let o = 0; o < i.length; o += 2) m += i.charAt(o);
  for (let s = 1; s < i.length; s += 2) m += i.charAt(s);
  return app.globalData.ajaxOrigin + url + "signature=" + m;
};
const request = { //请求封装
  apiHttp: '',
  AppletType: '',
  appId: '',
  noLoginType: false, //未登录处理方式 1为不处理跳转,2为链式跳转保留原页面，默认删当前页跳转

  wxRequest: function (method, url, data, callback, errFun, failFun, _this) {
    let that = this
    let api = url
    for (let i in data) {
      if (data[i] === undefined || !data[i]) delete data[i]
      if (i === 'noLoginType') {
        this.noLoginType = data[i]
        delete data[i]
      }
    }

    //发起请求
    wx.request({
      url: getUrl(api),
      method: method,
      data: data,
      header: {
        'content-type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'token': wx.getStorageSync('token'),
        'AppletType': that.AppletType,
        // 'CityCode': cityCode,
      },
      dataType: 'json',
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          callback(res.data.result);
        } else {
          if (res.data.code == '403000') { //未登录

            var pop;
            if (_this.selectComponent("#authpop")) {
              pop = _this.selectComponent("#authpop");
              console.log(pop)
              pop.showpop()
           }


          } else if (res.data.code == '5005') { //未绑定手机
            wx.redirectTo({
              url: "/pages/login/bindPhone/bindPhone"
            });
          }
          if (res.data.code == '9999') { //报错
            let msg = res.data.message
            if (errFun) {
              errFun(res.data)
            } else {
              wx.showModal({
                title: '提示',
                content: msg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }
          } else {
            let msg = res.data.message
            if (errFun) {
              errFun(res.data)
            } else {
              wx.showModal({
                title: '提示',
                content: msg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }
          }
        }
      },
      fail: function (err) {
        wx.hideLoading();
        if (failFun) {
          failFun(err);
        }

      },
      complete: function () {
        wx.hideLoading()

      },
      timeout: function () {
        wx.hideLoading()

      }
    })
  },
  getNewTime: function (date) { //获取当前时间戳
    var time = util.formatTime(date ? date : new Date());
    return time.replace(new RegExp('/', 'g'), "-")
  },
  treeMap: function (obj) { //按照首字母排序
    let arr = [];
    for (var a in obj) {
      arr.push(a)
    }
    arr = arr.sort()
    let objNew = {}
    for (var i = 0; i < arr.length; i++) {
      for (var z in obj) {
        if (arr[i] == z) objNew[z] = obj[z]
      }
    }
    return objNew
  },

}
module.exports = request