//index.js
//获取应用实例
const app = getApp();
let id = "";
let formId = '';
Page({
    data: {
      data: '',
      istrue: '',
      isget : false, //控制领取按钮
      guestId: '',
      brand : '',
      activityId : '',
      isFolded : false,
      menu : false
    },
  onLoad: function (options) { 
    //页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
    id = options.id; // 品牌id
  },
  getPhoneNumber: function (e) { //获取手机号
    // 同意
    if (e.detail.errMsg == 'getPhoneNumber:ok'){
      let _self = this;
      app.util.ajax({
        url: '/tickets/ticket/' + id,
        method: 'POST',
        data: {
          formId: formId,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        },
        success: function (res) {
          let data = res.data;
          if (data.code == 200) {
           
            _self.setData({
              isget: true,
            })
          } else {
            wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 2000
            });
          }
        }
      })
     
    }else {
      wx.showToast({
        title: "您取消了授权",
        icon: 'none',
        duration: 2000
      });
    }
    
  } ,
  onShow : function () {
    this.getTickets()
  },
  getTickets : function () { //获取礼包详情
    let _self = this;
    app.util.ajax({
      url: '/tickets/ticket/' + id,
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          _self.setData({
            data: data.result,
            guestId: data.result.brand.guestId,
            brand: data.result.brand,
            activityId: data.result.activityId
          })
         wx.setNavigationBarTitle({
           title: _self.data.brand.brand,
         })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: this.data.inviter.nickname + '赠送给您一个礼包,请在' + this.data.expiredTime + '前领取！',
      imageUrl: "/images/share3.png",
      path: '/pages/tickets/index?id=' + id,
      success(res) {
        console.log(res);
      }
    }
  },
  receive : function (){ //领取礼包
    console.log(1212)
    let _self  = this;
    app.util.ajax({
      url: '/tickets/ticket/' +id,
      method: 'POST',
      data : {
        formId: formId
      },
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          _self.setData({
            isget: true,
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
    
  },
  submit: function (e) {
    console.log(e.detail.formId);
    formId = e.detail.formId ;
    console.log(formId)
    if (this.data.needPhone){
      this.getPhoneNumber()
    }else{
      this.receive()
    }
  },
  change: function (e) {
    this.setData({
      isFolded: !this.data.isFolded,
    })
  },
  switchTab :function () {
    wx.navigateTo({
      url: '/pages/benefit/index?guestId='+ this.data.guestId
    })
  },
  onHide : function () {
    this.setData({
      isget : false
    })
  },
  tobrand: function () {
    wx.switchTab({
      url: '/pages/brand/index'
    })
  },
})
