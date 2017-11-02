const app = getApp()
const WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        detailData: {},
        typeArr: ['完税', '现货', '直邮', '保税'],
        windosH: '',
        isshow: false,
        visable: false,
        type: 2,
        did: '',
        quantity: 1,
        timeDate: ''
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            did: options.did || 31
        });
        wx.getSystemInfo({
            success: res => {
                this.setData({
                    windosH: res.screenWidth
                })
            }
        })
        this.getData();
    },
    getData: function () {
        app.util.request({
            url: app.api.url.flashSaleDetail(),
            data: {
                did: this.data.did
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        detailData: res.data
                    })
                    if (res.data.promotion.countdown > 0) {
                        this.countdown();
                    }
                    if (res.data.goods_detail) {
                        WxParse.wxParse('goods_detail', 'html', res.data.goods_detail, this, 1);
                    }
                    wx.hideToast();
                } else {
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
    mask: function (event) {
        let type = event.currentTarget.dataset.type;
        this.setData({
            type: type,
            visable: !this.data.visable,
            isshow: !this.data.isshow
        })
    },
    changeNum: function (event) {
        let store = this.data.detailData.store_total - 0,
            quantity = this.data.quantity - 0,
            type = event.currentTarget.dataset.num - 0;
        if (type > 0) {
            if (quantity >= store) {
                return false;
            }
        } else if (type < 0) {
            if (quantity <= 1) {
                return false;
            }
        } else if (type == 0) {
            quantity = event.detail.value - 0;
            if (quantity > store) {
                quantity = store
            }
            if (quantity < 1) {
                quantity = 1
            }
        }
        this.setData({
            quantity: quantity + type
        })
    },
    countdown: function () {
        let detailData = this.data.detailData,
            time = setTimeout(() => {
                detailData.promotion.countdown -= 1;
                let dd = Math.floor(detailData.promotion.countdown / (3600 * 24)),
                    hh = Math.floor((detailData.promotion.countdown) / 3600) - dd * 24,
                    mm = Math.floor((detailData.promotion.countdown) / 60) - dd * 24 * 60 - hh * 60,
                    ss = detailData.promotion.countdown - dd * 24 * 3600 - hh * 3600 - mm * 60;
                this.setData({
                    detailData,
                    timeDate: dd + ' 天 ' + hh + ' 时 ' + mm + ' 分 ' + ss + ' 秒 '
                })
                if (detailData.promotion.countdown > 0) {
                    this.countdown();
                }
            }, 1000);
    },
    buyNow: function () {
        if (!this.data.detailData.store_total) {
            wx.showToast({
                title: '库存不足',
                image: app.api.STATIC + 'images/error.png'
            })
            return false;
        }
        app.util.request({
            url: app.api.url.flashConfirm(),
            data: {
                did: this.data.did,
                quantity: this.data.quantity
            },
            success: res => {
                if (res.code == 1) {
                    wx.navigateTo({
                        url: '/pages/order/spike_confirm?did=' + this.data.did + '&quantity=' + this.data.quantity,
                    })
                } else {
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                }
            }
        })
    }
})