//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

    },
    getUserInfo: function (e) {
      if (e.detail.errMsg == "getUserInfo:fail auth deny") {
          wx.showToast({
              title: "您取消授权",
              icon: 'none',
              duration: 2000
          });
      } else {
          wx.checkSession({
              success: function () {
                  //session_key 未过期，并且在本生命周期一直有效
                  console.log("token还在有效期")
                  wx.navigateBack({
                      delta: 1
                  })
              },
              fail: function () {
                  // session_key 已经失效，需要重新执行登录流程
                console.log("token不在有效期")
                  wx.login({
                      success: res => {
                          // 发送 res.code 到后台换取 openId, sessionKey, unionId
                          if (res.code) {
                              //发起网络请求
                              wx.request({
                                  url: app.util.getUrl('/auth/sign'),
                                  method: 'POST',
                                  header: {
                                      'apiKey': '6b774cc5eb7d45818a9c7cc0a4b6920f' // 默认值
                                  },
                                  data: {
                                      'code': res.code,
                                      "iv": e.detail.iv,
                                      "encryptedData": e.detail.encryptedData,
                                  },
                                  success: function (res) {
                                    console.log(2222333)
                                      let data = res.data;
                                      if (data.code == 200) {
                                          if (data.result.token) {
                                              wx.setStorageSync('token', data.result.token);
                                              app.globalData.token.token = data.result.token;
                                          }
                                          wx.navigateBack({
                                              delta: 1
                                          })
                                      } else {
                                          wx.showToast({
                                              title: data.message,
                                              duration: 2000
                                          });
                                      }
                                  }
                              })
                          } else {
                              console.log('登录失败！' + res.errMsg)
                          }
                      }
                  })
              },
          })
      }
      let _self = this;
      app.util.ajax({
        url: "/user",
        method: 'POST',
        data: {
          "iv": e.detail.iv,
          "encryptedData": e.detail.encryptedData,
          "rawData": e.detail.rawData,
          "signature": e.detail.signature,
        },
        success: function (res) {
          // let data = res.data;
          // if (data.code == 200) {

          // } else {
          //   wx.showToast({
          //     title: data.message,
          //     icon: 'none',
          //     duration: 2000
          //   });
          // }
        }
      })
        
    },
  
})
