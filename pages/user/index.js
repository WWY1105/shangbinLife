// pages/user/index.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        parentThis:this,
        cards:[],
        user:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            parentThis:this
        })
        this.getMyCard()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
   
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
     this.getUser()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    againRequest(){
        this.getUser()
    },
    getUser(){  
        let url='/user';
        let json={}
        app.request('get', url, json, (res) => {
           this.setData({user:res})
        },(err)=>{},(fail)=>{},this)
    },
    getMyCard(){  
        let url='/benefits/cards';
        let json={}
        app.request('get', url, json, (res) => {
           this.setData({cards:res})
        },(err)=>{},(fail)=>{})
    },

  
})