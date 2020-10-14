// pages/business/index.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that=this;
        wx.hideLoading();
        if (options.q !== undefined) {
            // let q = decodeURIComponent(options.q);
            let q=decodeURIComponent('http://u.ishangbin.cn/business?t=p&id=c83c8d8e247343689f8ca122aa66ad7f')
            //截取参数  options.q ='域名地址?bedcode=12345678';
            let type = that.getQueryVariable(q, 't');
            let id = that.getQueryVariable(q, 'id');
            //保存获取值
            that.setData({
                type,
                id
            })
            //执行开锁相关逻辑代码 
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
        this.getData()
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
    getData(){
        let url="";
        let json={};
        if(this.data.type=='p'){
            url='/business/promotes/'+this.data.id;
        }else if(this.data.type=='d'){
            url='/business/dynamics/'+this.data.id;
        }
        app.request('get', url, json, (res) => {
            console.log(res);
            if(res.business=='1010'){
                // 共享卡
                wx.redirectTo({
                  url: '/pages/buyCard/buyCard?activityId='+res.activityId+'&businessId='+res.businessId+"&shopId="+res.shopId,
                })
            }
          
        })
       
    },

    // * 参数一： url
    //* 参数二： 要截取参数名
    getQueryVariable: function (query, variable) {
        console.log(query)
        let paramsArr=query.split('?');
        let params='';
        if(paramsArr.length>0){
            params=paramsArr[1]
        }
        var vars = params.split("&");
        let value='';
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if(pair[0]==variable){
                value=pair[1];
                return value;
            }
        }
        return (false);
    },
})