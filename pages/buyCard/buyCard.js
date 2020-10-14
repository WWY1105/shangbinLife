// pages/buyCard/buyCard.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        instructions:'',
        activityId:'',
        data:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.activityId){
            this.setData({activityId:options.activityId
            })
        }
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
        this.getActivity()
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
    // 获取活动详情
    getActivity(){
        let url='/cards/activity/'+this.data.activityId;
        let json={};
        app.request('get', url, json, (res) => {
            let instructions='';
            if(res.instructions){
                instructions=app.convertHtmlToText(res.instructions)
            }
            this.setData({data:res,instructions})
        })
    },
    // 去购买
    toBuy(){
        let url=""
    },
})