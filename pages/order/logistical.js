// pages/order/logistical.js
const app = getApp();
Page({
    data: {
        list: [],
        order_sn: ''
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            order_sn: options.order_sn
        })
        this.getList();
    },
    getList: function (order_sn) {
        app.util.request({
            url: app.api.url.logistic(),
            data: {
                order_sn: this.data.order_sn
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        list : res.data
                    })
                    wx.hideToast();
                }else{
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