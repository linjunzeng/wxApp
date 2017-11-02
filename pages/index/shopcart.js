var app = getApp();
Page({
    data: {
        cartlist: [],
        overdue: [],
        img_url: '',
        checkall: false,
        addprcie: 0,
        cids: [],
        quantity: 0
    },
    onShow: function () {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            checkall: false
        })
        this.getCartList();
    },
    getCartList: function () {
        app.util.request({
            url: app.api.url.cartList(),
            success: res => {
                if (res.code == 1) {
                    let cartlist = res.data.stock;
                    for (var i in cartlist) {
                        cartlist[i].check = false;
                    }
                    this.setData({
                        overdue: res.data.overdue,
                        cartlist: cartlist,
                        img_url: res.data.img_url
                    })
                    this.settlement();
                    wx.hideToast();
                }
            }
        })
    },
    //购物车选择,删除
    checkAll: function () {
        let cartlist = this.data.cartlist;
        for (var i in cartlist) {
            cartlist[i].check = !this.data.checkall;
        }
        this.setData({
            cartlist: cartlist,
            checkall: !this.data.checkall
        })
        this.settlement();
    }, 
    checkSon: function (event) {
        let cartlist = this.data.cartlist,
            key = event.currentTarget.dataset.key,
            checkall = this.data.checkall,
            index = 0;
        cartlist[key].check = !cartlist[key].check;
        if (cartlist[key].check) {
            for (var i in cartlist) {
                if (cartlist[i].check) {
                    index++
                }
            }
            if (index == cartlist.length) {
                checkall = true
            }
        } else {
            checkall = false;
        }
        this.setData({
            cartlist: cartlist,
            checkall: checkall
        })
        this.settlement();
    },
    delCart: function (event) {
        var that = this,
            cids = [],
            index = [],
            key = event.currentTarget.dataset.key,
            cartlist = this.data.cartlist;
        if (key == 'all') {
            for (var i in cartlist) {
                if (cartlist[i].check) {
                    cids[cids.length] = cartlist[i].cid;
                    index[index.length] = i;
                }
            }
            if (cids.length == 0) {
                wx.showToast({
                    title: '请选择删除的选项',
                    image: app.api.STATIC + 'images/error.png'
                })
                return false;
            }
        } else {
            cids[cids.length] = cartlist[key].cid;
            index[index.length] = key;
        }
        wx.showModal({
            content: '确定删除所选商品吗？',
            confirmColor: '#e41b45',
            success: res => {
                if (res.confirm){
                    wx.showToast({
                        title: '处理中',
                        icon: 'loading',
                        duration: 10000
                    })
                    app.util.request({
                        url: app.api.url.delCart(),
                        data: {
                            cids: cids.toString()
                        },
                        success: res => {
                            if (res.code == 1) {
                                for (var i in index) {
                                    index[i] = index[i] - i;
                                    cartlist.splice(index[i], 1);
                                }
                                this.setData({
                                    cartlist: cartlist
                                })
                                wx.hideToast();
                                this.settlement();
                            }else{
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
    //数量改变
    changeNum: function (event) {
        let key = event.currentTarget.dataset.key - 0,
            type = event.currentTarget.dataset.type - 0,
            cartlist = this.data.cartlist,
            quantity = cartlist[key].quantity - 0,
            store = cartlist[key].store_total - 0,
            lastquantity = cartlist[key].lastquantity - 0;

        if (type > 0) {
            if (quantity >= store) {
                return false;
            }
            quantity = quantity + type
        } else if (type < 0) {
            if (quantity <= 1) {
                return false;
            }
            quantity = quantity + type
        } else if (type == 0) {
            quantity = event.detail.value - 0;
            if (quantity > store) {
                quantity = store
            }
            if (quantity < 1) {
                quantity = 1
            }
        }
        if (lastquantity == quantity) {
            return false;
        }
        app.util.request({
            url: app.api.url.updateCart(), 
            data: {
                cid: cartlist[key].cid,
                quantity: quantity
            },
            success: res => {
                if (res.code == 1) {
                    cartlist[key].quantity = quantity;
                    cartlist[key].lastquantity = quantity;
                    this.setData({
                        cartlist: cartlist
                    })
                    this.settlement();
                }else{
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                }
            }
        })
    },
    //统计
    settlement: function () {
        var addprcie = 0,
            quantity = 0,
            cids = [];
        for (var i = 0, len = this.data.cartlist.length; i < len; i++) {
            if (this.data.cartlist[i].check) {
                addprcie += this.data.cartlist[i].quantity * this.data.cartlist[i].price_sale;
                quantity += this.data.cartlist[i].quantity - 0;
                cids[cids.length] = this.data.cartlist[i].cid;
            }
        }
        this.setData({
            addprcie: addprcie.toFixed(2),
            quantity: quantity,
            cids: cids,
        })
    },
    //清空失效
    clearGoods: function () {
        wx.showToast({
            title: '清理中',
            icon: 'loading'
        })
        let i = 0, len = this.data.overdue.length,
            cids = [];
        for (; i < len; i++) {
            cids[cids.length] = this.data.overdue[i].cid
        }
        app.util.request({
            url: app.api.url.delCart(),
            data: {
                cids: cids.toString()
            },
            success: res => {
                if (res.code == 1) {
                    wx.hideToast();
                    this.setData({
                        overdue: []
                    })
                }else{
                    wx.showToast({
                        title: '请选择删除的选项',
                        image: app.api.STATIC + 'images/error.png'
                    })
                }
            }
        })
    },
    cartConfirm: function () {
        if (this.data.cids.length == 0) {
            wx.showToast({
                title: '请选择商品',
                image: app.api.STATIC + 'images/error.png'
            })
            return false;
        }
        app.util.request({
            url: app.api.url.orderConfirm(),
            data: {
                cids: this.data.cids.toString()
            },
            success: res => {
                if (res.code == 1) {
                    wx.navigateTo({
                        url: '/pages/order/confirm?cids=' + this.data.cids.toString()
                    })
                }else{
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                }
            }
        })
    }
})