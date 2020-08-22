//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
      data: '',
      loading: true,
      searchT : '',
      items : [],
      pageSize: '',
      pageNum: 1,   // 设置加载的第几次，默认是第一次
      searchLoadingComplete: false ,  //“没有数据”的变量，默认false，隐藏
      searchLoading: false  //“没有数据”的变量，默认false，隐藏
    },
  onLoad: function (options) { 
    //页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
  },
  bindKeyInput: function (e) { //获取输入框的邀请码
    this.setData({
      searchT: e.detail.value
    })
  },
  onShow : function () {
    if (this.data.pageNum == this.data.pageSize){
      return;
    }
    let _self = this;
    _self.setData({
      searchLoadingComplete: false,
      searchLoading: false,
    })
    app.util.ajax({
      url: '/brands',
      data : {
        page : 1,
        count : 20
      },
      success: function (res) {
        let data = res.data;
        if(data.code == 200 ) {
          _self.setData({
              data: data.result,
              pageSize: data.result.pageSize,
              items: data.result.items,
              loading: false,
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
  onPullDownRefresh: function () {
    this.setData({
      pageNum : 1
    })
    // _self.setData({
    //   searchLoadingComplete: false,
    //   searchLoading: false,
    // })
    let _self = this;
    app.util.ajax({
      url: '/brands',
      data: {
        page: 1,
        count: 20
      },
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          _self.setData({
            data: data.result,
            pageSize: data.result.pageSize,
            items: data.result.items,
            searchT: '',
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
    setTimeout(function () {
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
        if (that.data.searchLoadingComplete){
          that.setData({
            searchLoading: false   //把"上拉加载"的变量设为false，显示
          });
        }
      }, 1000)
    }else {
      that.setData({
        searchLoading: false ,  //把"上拉加载"的变量设为false，显示
        searchLoadingComplete : true
      });
    }
  },
  onShareAppMessage: function () {
    return {
      title: '预定越早，优惠越大！',
      path: '/pages/brand/index',
      success(res) {
          console.log(res);
      }
    }
  },
  getbrand : function () {
    let _self = this;
    app.util.ajax({
      url: '/brands',
      data: {
        page: this.data.pageNum,
        count: 20
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
  },
  searchStore : function () {
    let _self = this;
      app.util.ajax({
        url: '/brands',
        data: {
          keyword: encodeURIComponent(this.data.searchT),
          page: 1,
          count: 20
        },
        success: function (res) {
          let data = res.data;
          if (data.code == 200) {
            _self.setData({
              data: data.result,
              pageSize: data.result.pageSize,
              items: data.result.items,
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
  all: function () {
    let _self = this;
    app.util.ajax({
      url: '/brands',
      data: {
        keyword: '',
        page: 1,
        count: 20
      },
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          _self.setData({
            data: data.result,
            pageSize: data.result.pageSize,
            items: data.result.items,
            searchT : ''
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
}) 