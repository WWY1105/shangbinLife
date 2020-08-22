//index.js
//获取应用实例
const app = getApp();
let guestId = ''
Page({
    data: {
      data: '',
      guestId : ''
    },
  onLoad: function (options) { 
    //页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
  },
  onLoad: function (options) {
    //页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
    guestId = options.guestId; // 品牌id
    console.log(guestId)
    this.setData({
      guestId: options.guestId,
    })
  },
}) 