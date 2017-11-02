// pages/index/category.js
const app = getApp()
Page({
    data: {
        need: 1,
        firstList: [],
        seconds: {
            adv: {},
            brand: []
        },
        brand: [],
        img_url: '',
        firstcid: ''
    },
    onLoad: function (){
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.getData();
    },
    getCategory: function (event) {
        let firstcid = event.currentTarget.dataset.cid;
        if (firstcid) {
            this.setData({
                firstcid: firstcid
            })
        }
        this.getData();
    },
    getData: function(){
        let data = {};
        data.need = this.data.need;
        if (this.data.firstcid) {
            data.cid = this.data.firstcid;
        }
        app.util.request({
            url: app.api.url.category(),
            data: data,
            success: res => {
                if (res.code == 1) {
                    if (this.data.need == 1) {
                        this.setData({
                            firstList: res.data.first.cate,
                            img_url: res.data.first.img_url,
                            firstcid: data.cid ? data.cid : res.data.first.cate[0].cid,
                            need: 0
                        })
                    }
                    this.setData({
                        seconds: res.data.seconds
                    })
                    wx.hideToast();
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