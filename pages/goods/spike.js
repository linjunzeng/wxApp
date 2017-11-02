// pages/goods/spike.js
const app = getApp();
Page({
    data: {
        goodsList: [],
        page: 1,
        pid: '',
        isload: false,
        nomore: false,
        error: false
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            pid: options.pid || 8
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
            url: app.api.url.flashSale(),
            data: {
                page: this.data.page,
                pid: this.data.pid
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        goodsList: this.data.goodsList.concat(res.data),
                        page: ++this.data.page,
                        nomore: res.data.length == 0 ? true : false,
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