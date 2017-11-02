// pages/order/pay.js
const app = getApp();
Page({
    data: {
        order_sn: '',
        orderinfo: {},
        pay_type: 2,
        payinfo: {}
    },
    onLoad: function (options){
        let order_sn = options.order_sn;
        if (!order_sn) {
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
        wx.showToast({
            icon: 'loading',
            title: '加载中'
        })
        this.setData({
            order_sn: order_sn
        })
        this.getInfo();
    },
    getInfo: function () {
        app.util.request({
            url: app.api.url.submitDetail(),
            data: {
                order_sn: this.data.order_sn
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        orderinfo: res.data
                    })
                    wx.hideToast();
                }else{
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                    if (res.code == 3001){
                        setTimeout(function () {
                            wx.switchTab({
                                url: '/pages/order/pay_success?type_id=' + res.data.order_type + '&order_sn=' + res.data.order_sn
                            })
                        }, 1500)
                    }else{
                        setTimeout(function () {
                            wx.switchTab({
                                url: '/pages/index/index'
                            })
                        }, 1500)
                    }
                }
            }
        })
    },
    paySubmit: function () {
        wx.login({
            success: res => {
                app.util.wecharPay({
                    pay_id: this.data.pay_type,
                    type_id: this.data.orderinfo.order_type,
                    order_sn: this.data.orderinfo.order_sn,
                    terminal: 1,
                    code: res.code
                })
            }
        })
    }
})