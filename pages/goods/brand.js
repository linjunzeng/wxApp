// pages/goods/brand.js
const app = getApp();
Page({
    data: {
        menuList: [],
        brandList: [],
        img_url: '',
        page: 1,
        cid: '',
        size: 20,
        need: 1,
        isload: false,
        nomore: false,
        error: false
    },
    onLoad: function (options) {
        this.setData({
            cid: options.cid || 436
        })
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.getData();
    },
    onReachBottom: function(){
        this.getData();
    },
    getData: function(){
        if (this.data.isload) { return false; }
        if (this.data.nomore) { return false; }
        this.setData({
            error: false,
            isload: true
        })
        app.util.request({
            url: app.api.url.getBrand(),
            data: {
                cid: this.data.cid,
                page: this.data.page,
                need: this.data.need,
                size: this.data.size,
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        menuList: res.data.category,
                        brandList: this.data.brandList.concat(res.data.brand),
                        img_url: res.data.img_url,
                        neet: 0,
                        nomore: res.data.brand.length < this.data.size ? true : false,
                        page: ++this.data.page,
                        isload: false
                    })
                    wx.hideToast();
                }else{
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