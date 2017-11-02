// pages/regiment/join.js
const app = getApp();
Page({
    data: {
        detail: null,
        downtime: '',
        iids: [],
        isshow: false,
        visable: false,
        type: 2,
        spce_id: 0,
        spec_sn: 0,
        spec_name: [],
        price_sale: 0,
        store: 0
    },
    onLoad: function (options) {
        this.setData({
            lid: options.lid || 59,
            rid: options.rid || 19
        })
        wx.showToast({
            icon: 'loading',
            title: '加载中'
        })
        this.getDetail();
    },
    getDetail: function(){
        app.util.request({
            url: app.api.url.regimentList(),
            data: {
                lid: this.data.lid
            },
            success: res => {
                let iids = [], sid = 0, store = 0, price_sale = 0;
                if (res.code == 1) {
                    if (res.data.goods.spec_type > 0) {
                        for (let i = 0; i < res.data.goods.spec_type; i++) {
                            iids[i] = 0
                        }
                        store = res.data.goods.store_total_all;
                    } else {
                        sid = res.data.goods.default_specsn,
                        store = res.data.specs.items_data[sid].store_total,
                        price_sale = res.data.specs.items_data[sid].price_group;
                    }
                    this.setData({
                        detail: res.data,
                        sid: sid,
                        store: store,
                        iids: iids,
                        price_sale: price_sale
                    })
                    if (res.data.regiment_list.countdown > 0) {
                        this.countdown(res.data.regiment_list.countdown);
                    }
                    wx.hideToast();
                } else {
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                    setTimeout(function () {
                        wx.switchTab({
                            url: '/pages/index/index'
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
            let spec_item = this.data.detail.specs.items_data[iids.join('_')];
            let price_sale = spec_item.price_group;
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
            url: app.api.url.joinRegiment(),
            data: {
                sid: this.data.sid,
                lid: this.data.lid,
            },
            success: res => {
                if (res.code == 1) {
                    wx.navigateTo({
                        url: './confirm?sid=' + this.data.sid + '&lid=' + this.data.lid + '&rid=' + this.data.rid
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
    countdown: function (countdown) {
        let daytime = 86400,  //3600*24,
            tt = 1440, //24 * 60,
            time = setTimeout(() => {
                countdown -= 1;
                let hh = Math.floor((countdown) / 3600),
                    mm = Math.floor((countdown) / 60) - hh * 60,
                    ss = countdown - hh * 3600 - mm * 60;
                hh = hh >= 10 ? hh : '0' + hh;
                mm = mm >= 10 ? mm : '0' + mm;
                ss = ss >= 10 ? ss : '0' + ss;
                if (countdown > 0) {
                    this.countdown(countdown);
                    this.setData({
                        downtime: hh + ' : ' + mm + ' : ' + ss
                    })
                }
            }, 1000);
    },
    onShareAppMessage: function () {

    }
})