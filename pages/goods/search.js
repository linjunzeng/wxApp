// pages/goods/search.js
const app = getApp();
Page({
    data: {
        keyword: '',
        logarr: [],
        hotarr: []
    },
    onLoad: function () {
        let logarr = wx.getStorageSync('searchLog') || '';
        this.getHot();
        if (logarr){
            this.setData({
                logarr: logarr
            })
        }
    }, 
    getHot: function () {
        app.util.request({
            url: app.api.url.goodsSearch(),
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        hotarr : res.data.hots
                    })
                }else{
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                }
            }
        })
    },
    setKeyword: function (event) {
        this.setData({
            keyword: event.detail.value
        })
    },
    searchForm: function (event) {
        let keyword = event.currentTarget.dataset.item || this.data.keyword,
            logarr = this.data.logarr;
        if (!keyword){
            wx.showToast({
                title: '请输入关键词',
                image: app.api.STATIC + 'images/error.png'
            })
            return false;
        }
        if (this.data.logarr.indexOf(keyword) < 0) {
            logarr[logarr.length] = keyword;
            this.setData({
                logarr: logarr
            })
            wx.setStorageSync('searchLog', logarr);
        }
        this.setData({
            keyword: keyword
        })
        wx.navigateTo({
            url: './list?keyword=' + keyword
        })
        return false
    },
    clearLog: function () {
        wx.removeStorageSync('searchLog');
        this.setData({
            logarr: []
        })
    },
    onShareAppMessage: function () {
    
    }
})