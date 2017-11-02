// pages/partition/country.js
const app = getApp();
Page({
    data: {
        menuList: [],
        banner: [],
        goodsList: [],
        img_url: '',
        page: 1,
        cid: '',
        size: 10,
        need_country: 1,
        isload: false,
        nomore: false,
        error: false
    },
    onLoad: function (options) {
        this.setData({
            cid: options.cid || ''
        })
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
    getData: function(){
        if (this.data.isload) { return false; }
        if (this.data.nomore) { return false; }
        this.setData({
            error: false,
            isload: true
        })
        let data = {
            page: this.data.page,
            need_country: this.data.need_country,
            size: this.data.size
        }
        if (this.data.cid){
            data.cid = this.data.cid
        }
        app.util.request({
            url: app.api.url.nationalPavilions(),
            data: data,
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        menuList: res.data.country,
                        goodsList: this.data.goodsList.concat(res.data.goods), 
                        banner: res.data.adv.son,
                        img_url: res.data.img_url,
                        need_country: 0,
                        nomore: res.data.goods.length < this.data.size ? true : false,
                        page: ++this.data.page,
                        isload: false,
                        cid: this.data.cid ? this.data.cid : res.data.country[0].cid
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