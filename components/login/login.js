// pages/component/auth.js
const app = getApp()
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      showComponent: {
         type: Boolean,
         value: true
      },
      parentThis: {
         type: Object,
         value: ''
      },
      scene:{
         type:String,
         value:''
      },
      showImg: {
         type: Boolean,
         value: false
      }
   },

   attached: function () {
      //console.log("0000")
      //console.log(this.data)
      // this.authinit()
   },

   /**
    * 组件的初始数据
    */
   data: {
      showImg: false,
      code: '',
      userInfo: '',
      hasUserInfo: '',
      lock: false
   },

   /**
    * 组件的方法列表
    */
   methods: {
      test: function () {
         //console.log("调用成功")
      },
      showpop: function () {
         this.setData({
            showImg: true
         })
      },
      hiddenpop: function () {
         //console.log("隐藏成功")
         this.setData({
            showImg: false
         })
      },
      authinit: function () {
         //console.log("11111")
         var _self = this
         if (wx.getStorageSync('token')) {
            //console.log("有token")
            wx.checkSession({
               success() {

               },
               fail() {
                  wx.login({
                     success: res => {
                        if (res.code) {
                           _self.setData({
                              code: res.code
                           })
                           //发起网络请求
                           wx.request({
                              url: app.util.getUrl('/auth'),
                              method: 'POST',
                              header: app.globalData.token,
                              data: {
                                 code: res.code
                              },
                              success: function (res) {
                                 let data = res.data;
                                 if (data.code == 200) {
                                    if (data.result.token) {
                                       wx.setStorageSync('token', data.result.token);
                                       app.globalData.token.token = data.result.token;
                                    }
                                    console.log(getCurrentPages())
                                    if (getCurrentPages().length != 0) {
                                       //刷新当前页面的数据
                                       //console.log(1)
                                       getCurrentPages()[getCurrentPages().length - 1].onShow()
                                    }
                                 } else {
                                    _self.setData({
                                       show: true
                                    })
                                 }
                              }
                           })
                        } else {
                           //console.log('登录失败！' + res.errMsg)
                        }
                     }
                  })
               }
            })
         } else {
            //console.log("无token")
            wx.login({
               success: res => {
                  if (res.code) {
                     _self.setData({
                        code: res.code
                     })
                     //发起网络请求
                     wx.request({
                        url: app.util.getUrl('/auth'),
                        method: 'POST',
                        header: app.globalData.token,
                        data: {
                           code: res.code
                        },
                        success: function (res) {
                           let data = res.data;
                           if (data.code == 200) {
                              if (data.result.token) {
                                 wx.setStorageSync('token', data.result.token);
                                 app.globalData.token.token = data.result.token;
                              }
                              if (getCurrentPages().length != 0) {
                                 //刷新当前页面的数据
                                 //console.log(1)
                                 getCurrentPages()[getCurrentPages().length - 1].onShow()
                              }
                           } else {
                              _self.setData({
                                 showImg: true
                              })
                           }
                        }
                     })
                  } else {
                     //console.log('登录失败！' + res.errMsg)
                  }
               }
            })

         }
      },
      click() {
         wx.showLoading({
            title: '加载中',
         })
      },
      closeShowImg(){
         this.setData({
            showImg:false
         })
      },
      getUserInfo: function (e) {
         console.log(e)
         wx.showLoading({
            title: '加载中',
         })
         if (this.data.lock) {
            return;
         }
         let _self = this;
         _self.setData({
            lock: true
         })
         if (e.detail.errMsg == "getUserInfo:fail auth deny") {
            wx.showToast({
               title: "取消授权",
               icon: 'none',
               duration: 2000
            });
            _self.setData({
               lock: false
            })
         } else {
            wx.login({
               success: res => {
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
                        wx.hideLoading();
                        let data = res.data;
                        if (data.code == 200) {
                           if (data.result.token) {
                              wx.setStorageSync('token', data.result.token);
                              app.globalData.token.token = data.result.token;
                           }
                           if (getCurrentPages().length != 0) {
                              //刷新当前页面的数据
                              console.log(_self.data.parentThis)
                              _self.data.parentThis.againRequest()
                           }
                        } else {
                           wx.showToast({
                              title: data.message + '',
                              duration: 2000
                           });
                           _self.setData({
                              showImg: false,
                              lock: false
                           })
                        }
                     },
                     fail: function (res) {
                        wx.hideLoading();
                        _self.setData({
                           showImg: false,
                           lock: false
                        })
                        let data = res.data;
                        wx.showToast({
                           title: data.message,
                           duration: 2000
                        });

                     }
                  })
               }
            })

         }
      },
   }
})
