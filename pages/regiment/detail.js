const app = getApp()
const WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        detailData : null,
        typeArr: ['完税', '现货', '直邮', '保税'],
        windosH: '',
        iids: [],
        isshow: false,
        visable: false,
        type: 2,
        spce_id: 0,
        spec_sn: 0,
        spec_name: [],
        price_sale: 0,
        sid: 0,
        rid: 0,
        quantity: 1,
        store: 0,
        timeArr: [],
        regiment_arr: 0
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            rid: options.rid
        })
        this.getData();
        wx.getSystemInfo({
            success: res => {
                this.setData({
                    windosH: res.screenWidth
                })
            }
        })

    },
    getData: function () {
        app.util.request({
            url: app.api.url.regimentDetail(),
            data: {
                rid: this.data.rid
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
                        price_sale = res.data.specs.items_data[sid].price_group;
                    }
                    let regiment_list = res.data.regiment_list,
                        regiment_arr = this.data.regiment_arr;
                    if (regiment_list.length > 0) {
                        for (let i = 0, len = regiment_list.length; i < len; i++) {
                            if (regiment_list[i].countdown > 0) {
                                this.countdown(regiment_list[i].countdown, i);
                                regiment_arr = regiment_arr + 1
                            }
                        }
                    }
                    this.setData({
                        detailData: res.data,
                        iids: iids,
                        sid: sid,
                        store: store,
                        price_sale: price_sale,
                        regiment_arr: regiment_arr
                    })
                    if (res.data.goods_detail) {
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
            url: app.api.url.regimentConfirm(),
            data: {
                sid: this.data.sid,
                rid: this.data.rid,
            },
            success: res => {
                if (res.code == 1) {
                    wx.navigateTo({
                        url: './confirm?sid=' + this.data.sid + '&rid=' + this.data.rid
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
    countdown: function (countdown, i) {
        let daytime = 86400,  //3600*24,
            tt = 1440, //24 * 60,
            timeArr = this.data.timeArr,
            time = setTimeout(() => {
                countdown -= 1;
                let hh = Math.floor((countdown) / 3600),
                    mm = Math.floor((countdown) / 60) - hh * 60,
                    ss = countdown - hh * 3600 - mm * 60;
                hh = hh >= 10 ? hh : '0' + hh;
                mm = mm >= 10 ? mm : '0' + mm;
                ss = ss >= 10 ? ss : '0' + ss;
                if (countdown > 0) {
                    timeArr[i] = hh + ' : ' + mm + ' : ' + ss;
                    this.setData({
                        timeArr
                    })
                    this.countdown(countdown, i);
                }
            }, 1000);
    }
})