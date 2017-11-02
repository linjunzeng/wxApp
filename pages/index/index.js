//index.js
const app = getApp()

Page({
    data: {
        indexdata: {},
        HOST_STATIC: app.api.HOST_STATIC
    },
    onLoad: function () {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.getData()
    },
    getData: function () {
        app.util.request({
            url: app.api.url.index(),
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        indexdata : res.data
                    })
                    wx.hideToast();
                } else {
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                }
            },
            fail: res => {
                wx.hideToast();
                wx.showModal({
                    content: '加载失败,是否重新加载',
                    success: res => {
                        if (res.confirm) {
                            this.getData();
                        }
                    }
                })
            }
        })
    },
    navgate: function (event) {
        let url = app.util.getLink(event.currentTarget.dataset.url);
        if (url) {
            wx.navigateTo({
                url: url
            })
        }
    },
})
