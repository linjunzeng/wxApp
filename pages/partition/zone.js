// pages/partition/zone.js
const app = getApp();
Page({
    data: {
        adv: {},
        goodslist: [],
        img_url: '',
        page: 1,
        size: 10,
        isload: false,
        nomore: false,
        error: false,
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            name: options.name || 'export'
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
            url: app.api.url.zone(),
            data: {
                name: this.data.name,
                page: this.data.page,
                size: this.data.size
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        goodslist: this.data.goodslist.concat(res.data.goods),
                        adv: res.data.adv,
                        img_url: res.data.img_url,
                        nomore: res.data.goods.length < this.data.size ? true : false,
                        page: ++this.data.page,
                        isload: false
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.act_name
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