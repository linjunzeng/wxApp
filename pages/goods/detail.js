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
        iids: [],
        spce_id: 0,
        spec_sn: 0,
        spec_name: [],
        specStr: '',
        price_sale: 0,
        sid: 0,
        quantity: 1,
        store: 0,
        like: false
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.getData(options.gsn);
        wx.getSystemInfo({
            success: res => {
                this.setData({
                    windosH: res.screenWidth
                })
            }
        })
        
    },
    getData: function(gsn){
        app.util.request({
            url: app.api.url.goodsDetail(),
            data: {
                gsn: gsn
            },
            success: res => {
                let iids = [], sid = 0, store = 0, price_sale = 0;
                if (res.code == 1) {
                    if (res.data.spec_type > 0) {
                        for (let i = 0; i < res.data.spec_type; i++) {
                            iids[i] = 0
                        }
                        store = res.data.store_total_all;
                    } else {
                        sid = res.data.default_spec,
                        store = res.data.specs.items_data[sid].store_total,
                        price_sale = res.data.specs.items_data[sid].price_sale;
                    }
                    this.setData({
                        detailData: res.data,
                        like: res.data.collect ? true : false,
                        iids: iids,
                        sid: sid,
                        store: store,
                        price_sale: price_sale
                    })
                    if (res.data.goods_detail){
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
        // if (visable) {
        //     visable = !visable;
        //     setTimeout(() => {
        //         this.setData({
        //             isshow : !isshow
        //         })
        //     }, 400)
        // } else {
        //     isshow = !isshow;
        //     visable = !visable;
        // }
        this.setData({
            type: type,
            visable: !this.data.visable,
            isshow: !this.data.isshow
        })
    },
    checkSpec: function (event) {
        let key = event.currentTarget.dataset.key,
            iid = event.currentTarget.dataset.iid,
            name = event.currentTarget.dataset.name,
            iids = this.data.iids,
            spec_name = this.data.spec_name;
        iids[key] = iid;
        spec_name[key] = name;
        let specStr = spec_name.join(' , ');
        if (iids.indexOf(0) < 0) {
            let spec_item = this.data.detailData.specs.items_data[iids.join('_')];
            let price_sale = spec_item.price_sale;
            let sid = spec_item.sid;
            let store = spec_item.store_total;
            let quantity = this.data.quantity;
            if (quantity > store) {
                quantity = store
            }
            this.setData({
                price_sale: price_sale,
                sid: sid,
                store: store,
                quantity: quantity
            })
        }
        this.setData({
            iids: iids,
            spec_name: spec_name,
            specStr: specStr
        })
    },
    changeNum: function (event) {
        let store = this.data.store - 0,
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
            quantity : quantity + type
        })
    },
    addCart: function () {
        if (!this.data.sid) {
            wx.showToast({
                title: '请选择规格',
                image: app.api.STATIC + 'images/error.png'
            })
            return false;
        }
        if (!this.data.store) {
            wx.showToast({
                title: '库存不足',
                image: app.api.STATIC + 'images/error.png'
            })
            return false;
        }
        app.util.request({
            url: app.api.url.addCart(),
            data: {
                sid: this.data.sid,
                quantity: this.data.quantity
            },
            success: res => {
                if (res.code == 1) {
                    wx.showToast({
                        title: res.msg,
                        icon: 'success'
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
    buyNow: function () {
        if (!this.data.sid) {
            wx.showToast({
                title: '请选择规格',
                image: app.api.STATIC + 'images/error.png'
            })
            return false;
        }
        if (!this.data.store) {
            wx.showToast({
                title: '库存不足',
                image: app.api.STATIC + 'images/error.png'
            })
            return false;
        }
        app.util.request({
            url: app.api.url.buyNow(),
            data: {
                sid: this.data.sid,
                quantity: this.data.quantity
            },
            success: res => {
                if (res.code == 1) {
                    wx.navigateTo({
                        url: '/pages/order/confirm?cids=' + res.data.goods[0].cid,
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
    collect: function () {
        app.util.request({
            url: app.api.url.collect(),
            data: {
                gsn: this.data.detailData.gsn
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        like : !this.data.like
                    })
                    wx.showToast({
                        title: res.msg,
                        icon: 'success'
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