//index.js
//获取应用实例
const app = getApp();
let activityId = "";
Page({
    data: {
      data: '',
      pageNum: 1,   // 设置加载的第几次，默认是第一次
      pageSize : '',
      items : [],
      searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
      searchLoading: false  //“没有数据”的变量，默认false，隐藏
    },
  onLoad: function (options) { 
    activityId = options.activityId; // 活动id
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow();
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  //上拉分页,将页码加1，然后调用分页函数getbrand()
  onReachBottom: function () {
    var that = this;
    if (that.data.pageNum < that.data.pageSize) {
      var pageNum = that.data.pageNum;
      that.setData({
        pageNum: ++pageNum,
        searchLoading: true   //把"上拉加载"的变量设为false，显示
      });
      setTimeout(function () {
        that.getbrand();
        if (that.data.searchLoadingComplete) {
          that.setData({
            searchLoading: false   //把"上拉加载"的变量设为false，显示
          });
        }
      }, 1000)
    } else {
      that.setData({
        searchLoading: false,  //把"上拉加载"的变量设为false，显示
        searchLoadingComplete: true
      });
    }
  },
  onShow : function () {
    if (this.data.pageNum == this.data.pageSize) {
      return;
    }
    let _self = this;
    app.util.ajax({
      url: '/activities/ticket/' + activityId + '/obtains',
      data: {
        page: 1,
        count: 20
      },
      success: function (res) {
        let data = res.data;
        if(data.code == 200 ) {
          _self.setData({
              data: data.result,
              pageSize: data.result.pageSize,
              items: data.result.items
          })
          console.log(_self.data.pageSize)
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
  getobtains : function () {
    let _self = this;
    app.util.ajax({
      url: '/activities/ticket/' + activityId + '/obtains',
      data: {
        page: this.data.pageNum,
        count: 10
      },
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          _self.setData({
            data: data.result,
            items: _self.data.items.concat(data.result.items),
          })
        } else {
          _self.setData({
            searchLoadingComplete: true,
            searchLoading: false,
          })
        }
      }
    })
  }
})
