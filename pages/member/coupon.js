// pages/member/coupon.js
const app = getApp()
Page({
    data: {
        couponData: [],
        state: 2
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            state: options.state || 2
        })
        this.getData();
    },
    getData: function () {
        app.util.request({
            url: app.api.url.userCoupon(),
            data: {
                state: this.data.state
            },
            success: res => {
                if (res.code == 1) {
                    for (let i in res.data){
                        res.data[i].coupon_start = app.util.formatDate(res.data[i].coupon_start, 'yyyy-MM-dd');
                        res.data[i].coupon_end = app.util.formatDate(res.data[i].coupon_end, 'yyyy-MM-dd');
                    }
                    this.setData({
                        couponData : res.data
                    })
                    wx.hideToast();
                }else{
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1500)
                }
            }
        })
    },
    tourl: function(event){
        this.setData({
            state: event.currentTarget.dataset.state,
            couponData: []
        })
        this.getData();
    },
    onShareAppMessage: function () {
    
    }
})