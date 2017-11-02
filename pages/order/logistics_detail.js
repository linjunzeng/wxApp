// pages/order/logistics_detail.js
const app = getApp();
Page({
    data: {
        logisticalData: [],
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.getList(options);
    },
    getList: function (options) {
        app.util.request({
            url: app.api.url.logistic(),
            data: {
                order_sn: options.order_sn,
                did: options.did
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        logisticalData: res.data
                    })
                    wx.hideToast();
                } else {
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                }
            }
        })
    },
    onShareAppMessage: function () {
    
    }
})