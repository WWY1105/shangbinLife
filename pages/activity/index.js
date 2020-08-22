//logs.js
const app = getApp();
let guestId = "";
let brand = "";
let _id = '';
let expiredTime = '';
let nickname = ''
Page({
    data: {
      data: [],
      isShow : '',
      inputValue : '',
      istrue : '',
      items : [],
      activityId : '', //活动id
      state : ''
    },
  onLoad: function (options) {
    wx.hideShareMenu();
    // 生命周期函数--监听页面加载
    guestId = options.guestId; // 获取路由参数 品牌id
    brand = options.brand; // 获取路由参数
    showView: (options.istrue == "true" ? true : false) 
    wx.setNavigationBarTitle({
      title: brand
    })
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: nickname +'赠送给您一个礼包,请在' + expiredTime + '前领取吧',
      imageUrl: "https://i.ishangbin.com/img/user/images/share.jpg",
        path: '/pages/tickets/index?id=' + _id,
        success(res) {
          if (res.errMsg == 'shareAppMessage:ok') {
            
          }
        }
    }
  },
  onShow: function () {
      let _self = this;
      app.util.ajax({
        url: '/activities/ticket/guest',
        data :{
          guestId: guestId
        },
        success: function (res) {
          let data = res.data;
          if (data.code == 200) {
              _self.setData({
                data: data.result,
                items: data.result,
            })
          }else {
            _self.setData({
              state: true,
            })
          }
        }
      });
  },
  changeshow : function (e) { //控制输入框
    let _self = this;
    _self.setData({
      isShow : true,
      istrue: false,
      activityId: e.target.id
    })
  },
  bindKeyInput: function (e) { //获取输入框的邀请码
    this.setData({
      inputValue: e.detail.value
    })
  },
  checknum : function (e) { //验证邀请码
    if (this.data.inputValue){
      let _self = this;
      app.util.ajax({
        url: '/tickets/ticket',
        method : 'POST',
        data: {
          activityId: this.data.activityId , //活动id
          validateCode: this.data.inputValue,
          guestId: guestId //品牌id
        },
        success: function (res) {
          let data = res.data;
          if (data.code == 200) {
            _id  = data.result.id;
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
    }else {
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none',
        duration: 1200,
        mask: true
      });

    }
  },
  closebtn : function() { 
    let _self = this;
    _self.setData({
      isShow: false,
      inputValue: ''
    })
  },
  preventTouchMove: function (e) {

  },
  onHide: function () {
    this.closebtn();
  }
})
