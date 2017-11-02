const app = getApp();
Page({
    data: {
        goodslist: [],
        adv: null,
        isload: false,
        nomore: false,
        error: false,
        page: 1,
        size: 10
    },
    onLoad: function () {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.getData();
    },
    onReachBottom: function () {
        this.getData();
    },
    getData: function () {
        if (this.data.isload) { return false; }
        if (this.data.nomore) { return false; }
        this.setData({
            error: false,
            isload: true
        })
        app.util.request({
            url: app.api.url.regiment(),
            data: {
                page: this.data.page,
                size: this.data.size
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        goodslist: this.data.goodslist.concat(res.data.goods),
                        adv: res.data.adv,
                        nomore: res.data.goods.length < this.data.size ? true : false,
                        page: ++this.data.page,
                        isload: false
                    })
                    wx.hideToast();
                } else {
                    this.setData({
                        error: true,
                        isload: false
                    })
                    wx.hideToast();
                }
            }
        })
    },
    onShareAppMessage: function () {

    }
})