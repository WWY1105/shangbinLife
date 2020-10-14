//index.js
//获取应用实例
const app = getApp();

Page({
   data: {
      citys: {},
      location: {
         city: "021",
         name: "上海",
         longitude: "",
         latitude: "",
         location: '021'
      },
      count: 10,
      psge: 1,
      lastPage: false,
      shops: []
   },
   onLoad: function () {
      wx.showLoading({
         title: '加载中'
      })
      this.setData({
         page: 1,
         lastPage: false,
         shops: [],
      }, function () {
         this.getshops()
      })

   },
   onShow() {

   },



   // 获取商店列表
   getshops: function (put) {
      let _self = this;
      if (this.data.lastPage) return;
      let json = {
         "city": _self.data.location.city,
         "location": _self.data.location.location,
         "latitude": _self.data.location.latitude,
         "longitude": _self.data.location.longitude,
         "count": _self.data.count,
         "page": _self.data.page,
      }
      let url = '/shops';
      let page = this.data.page;
      app.request('get', url, json, (res) => {
         let shops= this.data.shops;
         let resultShops =shops ? shops.concat(res.items) : shops;
         page++;
         this.setData({
            shops:resultShops,
            page
         });
         if (res.items.length < this.data.count) {
            this.setData({
               lastPage: true
            })
         }
      })
   },

})