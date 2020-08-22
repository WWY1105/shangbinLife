//index.js
//获取应用实例
const app = getApp();
let guestId = ''
Page({
    data: {
      data: '',
      guestId : '',
      disabled : true,
      phone : '',
      code: '',
      codename : '获取验证码',
      iscode: null,//用于存放验证码接口里获取到的code
      isold : true,
      issend : false
    },
  onLoad: function (options) {
    //页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
    // guestId = options.guestId; // 品牌id
    // console.log(guestId)
    // this.setData({
    //   guestId: options.guestId,
    // })
  },
  onShow : function () {

  },
  getPhoneValue: function (e) { //手机号
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue: function (e) { //验证码
    this.setData({
      code: e.detail.value
    })
    console.log(e.detail.value)
    if (e.detail.value == this.data.iscode ){
      this.setData({
        disabled: false
      })
    }
  },
  getCode: function () { //获取验证码
    var a = this.data.phone;
    var _this = this;
    var myreg = /^1[3456789]\d{9}$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.request({
        'url': '/validate/bindup',
        data : {
          phone : a
        },
        success(res) {
          console.log(res.data.data)
          // _this.setData({
          //   iscode: res.data.data,
          // })
          var num = 61;
          var timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '重新发送',
                disabled: false,
              })

            } else {
              _this.setData({
                codename: '已发送'+num + "s",
                issend : true
              })
            }
          }, 1000)
        }
      })

    }


  },
  //获取验证码
  getVerificationCode() {
    this.getCode();
    var _this = this
    _this.setData({
      disabled: true
    })
  },
  check : function () { // 验证旧手机号
    console.log(1111)
    var a = this.data.phone;
    if (this.data.code != this.data.iscode) {
      wx.showToast({
        title: '验证码输入错误',
        icon: 'none',
        duration: 1000
      })
    }else {
      wx.request({
        'url': '/validate/binded',
        data: {
          phone: a
        },
        success(res) {
          console.log(res.data.data)
          // _this.setData({
          //   iscode: res.data.data,
          // })

        }
      })
    }
  },
  save : function () {
    var a = this.data.phone;
    var _this = this;
    var myreg = /^1[3456789]\d{9}$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (this.data.code != this.data.iscode) {
      wx.showToast({
        title: '验证码输入错误',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.request({
        'url': '/validate/bindup',
        data: {
          phone: a
        },
        success(res) {
          console.log(res.data.data)
          // _this.setData({
          //   iscode: res.data.data,
          // })
          
        }
      })

    }
  }
}) 