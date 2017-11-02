// pages/member/collection.js
const app = getApp()
Page({
    data: {
        collectionData: [],
        img_url: '',
        checkall: false,
        gsns: []
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.getCollectList();
    },
    getCollectList: function () {
        app.util.request({
            url: app.api.url.collectList(),
            success: res => {
                if (res.code == 1) {
                    var collectionData = res.data.list;
                    for (var i in collectionData) {
                        collectionData[i].check = false;
                    }
                    this.setData({
                        collectionData : collectionData,
                        img_url: res.data.img_url
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
    checkAll: function () {
        var collectionData = this.data.collectionData;
        for (var i in collectionData) {
            collectionData[i].check = !this.data.checkall;
        }
        this.setData({
            collectionData,
            checkall: !this.data.checkall
        })
    },
    checkSon: function (event) {
        var collectionData = this.data.collectionData,
            checkall = this.data.checkall,
            key = event.currentTarget.dataset.key,
            index = 0;
        collectionData[key].check = !collectionData[key].check;
        if (collectionData[key].check) {
            for (var i in collectionData) {
                if (collectionData[i].check) {
                    index++
                }
            }
            if (index == collectionData.length) {
                checkall = true
            }
        } else {
            checkall = false;
        }
        this.setData({
            collectionData,
            checkall: !this.data.checkall
        })
    },
    deleteList: function () {
        var gsns = [],
            index = [],
            collectionData = this.data.collectionData;
        for (var i in collectionData) {
            if (collectionData[i].check) {
                gsns[gsns.length] = collectionData[i].gsn;
                index[index.length] = i;
            }
        }
        if (gsns.length == 0) {
            wx.showToast({
                title: '请选择删除项',
                image: app.api.STATIC + 'images/error.png'
            })
            return false;
        }
        wx.showModal({
            content: '确定删除所选商品吗？',
            confirmColor: '#e41b45',
            success: res => {
                if (res.confirm) {
                    wx.showToast({
                        title: '处理中',
                        icon: 'loading',
                        duration: 10000
                    })
                    app.util.request({
                        url: app.api.url.collectCancel(),
                        data: {
                            gsns: gsns.toString()
                        },
                        success: res => {
                            if (res.code == 1) {
                                for (var i in index) {
                                    index[i] = index[i] - i;
                                    collectionData.splice(index[i], 1);
                                }
                                this.setData({
                                    collectionData: collectionData
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
                }
            }
        })
    },
    onShareAppMessage: function () {
    
    }
})