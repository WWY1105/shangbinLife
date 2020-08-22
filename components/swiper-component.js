Component({
    properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        data: {
            type: JSON,
            value: 'default value',
        }
    },
    data: {
        // 这里是一些组件内部数据
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        circular: true,
        interval: 2000,
        duration: 500,
        previousMargin: 0,
        nextMargin: 0
    },
    methods: {
        // 这里是一个自定义方法
        previewImage(e) {
            //获取当前图片的下表
            let index = e.currentTarget.dataset.index,
                //数据源
                pictures = this.data.data.picUrls;
            wx.previewImage({
                //当前显示下表
                current: pictures[index],
                //数据源
                urls: pictures
            })
        },
        changeProperty: function (e) {
            var propertyName = e.currentTarget.dataset.propertyName
            var newData = {}
            newData[propertyName] = e.detail.value
            this.setData(newData);
            console.log(this.data);
        },
        changeIndicatorDots: function (e) {
            this.setData({
                indicatorDots: !this.data.indicatorDots
            })
        },
        changeAutoplay: function (e) {
            this.setData({
                autoplay: !this.data.autoplay
            })
        },
        intervalChange: function (e) {
            this.setData({
                interval: e.detail.value
            })
        },
        durationChange: function (e) {
            this.setData({
                duration: e.detail.value
            })
        }
    }
})