// pages/order/pay_success.js
const app = getApp()
Page({
    data: {
        payinfo: {},
        type_id: 1
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        app.util.request({
            url: app.api.url.getGeneralOrder(),
            data: {
                order_sn: options.order_sn,
                type_id: options.type_id
            },
            success: res => {
                if (res.code == 1) {
                    if (res.code == 1) {
                        this.setData({
                            payinfo: res.data
                        })
                        wx.hideToast();
                    } else {
                        wx.showToast({
                            title: res.msg,
                            image: app.api.STATIC + 'images/error.png'
                        })
                        setTimeout(()=>{
                            if (options.type_id == 1) {
                                this.$router.replace('/order/list?status=0');
                            } else {
                                this.$router.replace('/member');
                            }
                        },1500)
                    }
                }else{
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
    onShareAppMessage: function () {
    
    }
})