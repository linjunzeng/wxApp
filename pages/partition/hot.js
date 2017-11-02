// pages/partition/hot.js
const app = getApp();
Page({
    data: {
        goodsList: [],
        banner: [],
        img_url: '',
        page: 1,
        size: 10,
        need_img: 1,
        isload: false,
        nomore: false,
        error: false
    },
    onLoad: function () {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
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
            url: app.api.url.hotSales(),
            data: {
                page: this.data.page,
                size: this.data.size,
                need_img: this.data.need_img
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        goodsList: this.data.goodsList.concat(res.data.goods),
                        banner: res.data.adv.son,
                        img_url: res.data.img_url,
                        need_img: 0,
                        nomore: res.data.goods.length < this.data.size ? true : false,
                        page: ++this.data.page,
                        isload: false
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