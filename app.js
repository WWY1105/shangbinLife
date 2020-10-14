//app.js
const util = require('./utils/util.js');
const md5 = require('/utils/md5.js')
const request = require('/utils/request.js')
const config = require('/config.js')
App({
  onShow: function (options) {
    var _this = this;
    this.globalData.scene = options.scene;
  },
  onLaunch: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    this.globalData.scene = options.scene;
    if (wx.getStorageSync('token')) {
      this.globalData.token.token = wx.getStorageSync('token');
    } else {}
  },


  onHide: () => {

  },
  request: function (method, url, data, callback, errFun, failFun,_this) {//整合请求接口
    request.apiHttp = this.globalData.config.local.apiHttp;
    request.wxRequest(method, url, data, callback, errFun, failFun,_this)
  },


  locationCheck: function (callback) { //校验用户定位权限
    let that = this
    wx.getSetting({ //检查用户授予权限
      success: function (res) {
        if (!res.authSetting) { //如果请求过用户权限
          if (res.authSetting['scope.userLocation']) { //如果有权限直接获取经纬度
            that.getLocation(callback)
          } else { //如果没有权限直接让用户设置
            wx.showModal({
              title: '提示',
              content: '请授权位置信息，点击确定去授权',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success(res) {
                      console.log(res.authSetting)
                      // res.authSetting = {
                      //   "scope.userInfo": true,
                      //   "scope.userLocation": true
                      // }
                    }
                  })
                }
              }
            })
          }
        } else { //没请求过则直接请求弹窗权限
          that.getLocation(callback)
        }
      }
    })
  },
  _wxPay: function (payData, callback, failCallback) {
    let _that = this
    wx.requestPayment({
      timeStamp: payData.timestamp,
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: payData.signType,
      paySign: payData.paySign,
      success: function (result) {
        if (result.errMsg == 'requestPayment:ok') {
          //  wx.showLoading({
          //    title: '支付中'
          //  })
          let data = {
            orderId: payData.orderId,
          }
          if (callback) callback()
        } else {
          wx.showToast({
            title: '支付异常' + result.errMsg,
            icon: 'none',
            mask: true
          });
        }
      },
      fail: function (e) {
        // 取消支付
        console.info(e)
        failCallback()
        if (e == 'requestPayment:fail cancel') {


        }
      },
    })

  },

  getLocation: function (callback) { //获取用户定位
    var _that = this
    wx.getLocation({
      type: 'gcj02', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        wx.hideLoading()
        if (callback) {
          callback(res)
        } else {
          var longitude = res.longitude
          var latitude = res.latitude
          wx.setStorageSync('longitude', longitude)
          wx.setStorageSync('latitude', latitude)
        }
      },
      fail: function () { //如果不授权，直接设置默认城市
        // _that.getLatelyCinema(false)
        wx.showModal({
          title: '提示',
          content: '请您打开定位并授权，否则无法使用定位',
          confirmText: '去授权',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  wx.hideLoading()
                  console.log(res.authSetting)
                }
              })
            } else {
              if (callback) {
                callback()
              }
            }
          }
        })
      },
    })
  },
  convertHtmlToText: function convertHtmlToText(inputText) {
    var returnText = "" + inputText;
    returnText = returnText.replace(/<\/div>/ig, '\r\n');
    returnText = returnText.replace(/<\/li>/ig, '\r\n');
    returnText = returnText.replace(/<li>/ig, '  *  ');
    returnText = returnText.replace(/<\/ul>/ig, '\r\n');
    //-- remove BR tags and replace them with line break
    returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText = returnText.replace(/<p.*?>/gi, "\r\n");
    returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g, '');

    //-- get rid of html-encoded characters:
    returnText = returnText.replace(/ /gi, " ");
    returnText = returnText.replace(/&/gi, "&");
    returnText = returnText.replace(/"/gi, '"');
    returnText = returnText.replace(/</gi, '<');
    returnText = returnText.replace(/>/gi, '>');

    return returnText;
  },
  globalData: {

    userInfo: null,
    userPhone: null,
    config: config,//公共配置
    token: {
      'apiKey': '6b774cc5eb7d45818a9c7cc0a4b6920f'
    },
    scene: '',
    location: {},
    //  测试
    ajaxOrigin: "https://life.sharejoy.cn",
    urlOrigin: "https://m.sharejoy.cn"


    //  正式
    //   ajaxOrigin: "https://life.sharejoy.cn",
    //   urlOrigin: "https://m.sharejoy.cn"
  },

  util: util
})


