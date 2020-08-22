//index.js
//获取应用实例
const app = getApp();
let guestId = "";
let activityId = "";
let _id = ""
let brand = "";
let expiredTime = '';
let nickname = "";
Page({
    data: {
      data: '',
      loading: true,
      searchT : '',
      activities : [],
      isShow: '',
      istrue: '',
      brand : '',
      activityId : '',
      isFolded: true
    },
  onLoad: function (options) { 
    wx.hideShareMenu();
    //页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
    guestId = options.guestId; // 品牌id
    activityId = options.activityId; // 活动id
    this.setData({
      guestId: options.guestId,
      activityId: options.activityId
    })
    
  },
  bindKeyInput: function (e) { //获取输入框的邀请码
    this.setData({
      searchT: e.detail.value
    })
  },
  onShow : function () {
    let _self = this;
    app.util.ajax({
      url: '/activities/ticket/' + activityId,
      data : {
        guestId: guestId,
      },
      success: function (res) {
        let data = res.data;
        if(data.code == 200 ) {
          _self.setData({
              data: data.result,
              brand: data.result.brand
          })
          brand = data.result.brand.brand;
          wx.setNavigationBarTitle({
            title: brand
          })
        }else {
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
      title: nickname +'赠送给您一个礼包,请在' + expiredTime + '前领取',
      imageUrl: "https://i.ishangbin.com/img/user/images/share.jpg",
      path: '/pages/tickets/index?id=' + _id,
      success(res) {
        console.log(res);
        let _self = this;
        _self.setData({
          isShow: false
        })
      }
    }
  },
  changeshow: function (e) { //控制输入框显示
    let _self = this;
    _self.setData({
      isShow: true,
      
    })
  },
  bindKeyInput: function (e) { //获取输入框的邀请码
    this.setData({
      inputValue: e.detail.value
    })
  },
  checknum: function (e) { // 验证邀请码
    if (!this.data.inputValue) {
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none',
        duration: 1200,
        mask: true
      });
    }else {
      let _self = this;
      app.util.ajax({
        url: '/tickets/ticket',
        method: 'POST',
        data: {
          activityId: activityId, //活动id
          validateCode: this.data.inputValue,
          guestId: guestId //品牌id
        },
        success: function (res) {
          let data = res.data;
          if (data.code == 200) {
            _id = data.result.id;
            expiredTime = data.result.expiredTime;
            nickname = data.result.nickname;
            _self.setData({
              istrue: true, 
              inputValue: ''
            })
          } else {
            wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    }
  },
  closebtn: function () { 
    let _self = this;
    _self.setData({
      isShow: false,
      inputValue : ''
    })
  },
  change: function (e) {
    this.setData({
      isFolded: !this.data.isFolded,
    })
  },
  onHide: function () {
    this.closebtn();
  }
})
