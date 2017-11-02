// pages/order/confirm.js
const app = getApp();
Page({
    data: {
        detail: {
            address: {}
        },
        aid: 0,
        sid: 0,
        rid: 0,
        lid: 0,
        quantity: 1,
        remarks: ''
    },
    onLoad: function (options) {
        if (!options.sid || !options.rid) {
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
            sid: options.sid,
            rid: options.rid,
            lid: options.lid,
            aid: wx.getStorageSync('aid') || 0
        })
        wx.showToast({
            icon: 'loading',
            title: '加载中'
        })
        this.getConfirm();
    },
    getConfirm: function () {
        app.util.request({
            url: app.api.url.regimentConfirm(),
            data: {
                aid: this.data.aid,
                rid: this.data.rid,
                sid: this.data.sid
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
        let data = {
            remarks: this.data.remarks,
            aid: this.data.detail.parameter.aid,
            rid: this.data.rid,
            sid: this.data.sid,
            quantity: this.data.quantity
        }
        if (this.data.lid){
            data.lid = this.data.lid;
        }
        app.util.request({
            url: app.api.url.regimentSubmit(),
            data: data,
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