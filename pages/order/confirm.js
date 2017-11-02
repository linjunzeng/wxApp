// pages/order/confirm.js
const app = getApp();
Page({
    data: {
        detail: {
            address: {}
        },
        coupondata: [],
        cids: '',
        remarks: '',
        aid: 0,
        rid: 0,
        isshow: false,
        visable: false,
        discount: ''
    },
    onLoad: function (options) {
        if (!options.cids) {
            wx.showToast({
                title: '发生错误',
                image: app.api.STATIC + 'images/error.png'
            })
            setTimeout(function(){
                wx.switchTab({
                    url: '/pages/index/index'
                })
            },1500)
            return false;
        }
        this.setData({
            cids: options.cids,
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
            url: app.api.url.orderConfirm(),
            data: {
                cids: this.data.cids,
                aid: this.data.aid || 0
            },
            success: res => {
                if (res.code == 1) {
                    for (let i in res.data.coupon) {
                        res.data.coupon[i].coupon_start = app.util.formatDate(res.data.coupon[i].coupon_start);
                        res.data.coupon[i].coupon_end = app.util.formatDate(res.data.coupon[i].coupon_end);
                    }
                    this.setData({
                        detail: res.data
                    })
                    wx.hideToast();
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
    setRemarks: function(event){
        this.setData({
            remarks: event.detail.value
        })
    },
    mask: function () {
        if (!this.data.detail.coupon.length){
            return false;
        }
        this.setData({
            isshow: !this.data.isshow,
            visable: !this.data.visable
        })
    },
    selectCoupon: function (event) {
        let key = event.currentTarget.dataset.key;
        this.setData({
            isshow: false,
            visable: false,
            rid: this.data.detail.coupon[key].rid,
            discount: this.data.detail.coupon[key].coupon_discount
        })
    },
    cancelCoupon: function () {
        this.setData({
            isshow: false,
            visable: false,
            rid: 0,
            discount: ''
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
            url: app.api.url.orderSubmit(),
            data: {
                remarks: this.data.remarks,
                aid: this.data.detail.parameter.aid,
                cids: this.data.detail.parameter.cids,
                rid: this.data.rid
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