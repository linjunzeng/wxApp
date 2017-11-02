// pages/order/confirm.js
const app = getApp();
Page({
    data: {
        detail: {
            address: {}
        },
        remarks: '',
        aid: 0,
        isshow: false,
        visable: false,
        quantity: 1
    },
    onLoad: function (options) {
        if (!options.did) {
            wx.showToast({
                title: '发生错误',
                image: app.api.STATIC + 'images/error.png'
            })
            setTimeout(function () {
                wx.switchTab({
                    url: '/pages/index/index'
                })
            }, 1500)
            return false;
        }
        this.setData({
            did: options.did,
            quantity: options.quantity,
            aid: wx.getStorageSync('aid')
        })
        wx.showToast({
            icon: 'loading',
            title: '加载中'
        })
        this.getConfirm();
    },
    getConfirm: function () {
        app.util.request({
            url: app.api.url.flashConfirm(),
            data: {
                did: this.data.did,
                aid: this.data.aid || 0,
                quantity: this.data.quantity
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        detail: res.data
                    })
                    wx.hideToast();
                } else {
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                    setTimeout(function () {
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                    }, 1500)
                }
            }
        })
    },
    setRemarks: function (event) {
        this.setData({
            remarks: event.detail.value
        })
    },
    createOrder: function () {
        if (!this.data.detail.address.aid) {
            wx.showToast({
                title: '请添加收货地址',
                image: app.api.STATIC + 'images/error.png'
            })
            setTimeout(function () {
                wx.switchTab({
                    url: '/pages/member/add_address?isue=1'
                })
            }, 1500)
            return false
        }
        app.util.request({
            url: app.api.url.flashSubmit(),
            data: {
                remarks: this.data.remarks,
                aid: this.data.detail.parameter.aid,
                did: this.data.did,
                quantity: this.data.quantity
            },
            success: res => {
                if (res.code == 1) {
                    wx.redirectTo({
                        url: '/pages/order/pay?order_sn=' + res.data.order_sn
                    })
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