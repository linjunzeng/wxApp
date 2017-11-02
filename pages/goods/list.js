// pages/goods/list.js
const app = getApp();
Page({
    data: {
        style: 0,
        screen: false,
        goodslist: [],
        typelist: [],
        isload: false,
        nomore: false,
        error: false,
        keyword: '',
        cate: '',
        brand: '',
        price_min: '',
        price_max: '',
        pager: 1,
        orderby: 1,
        img_url: ''
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        let query = options;
        query.style = wx.getStorageSync('style') || 0;
        this.setData(query)
        this.getGoodsList();
        this.getType();
    },
    onReachBottom: function(){
        this.getGoodsList();
    },
    //排序
    changeSort: function (event) {
        let sort = event.currentTarget.dataset.sort - 0;
        this.setData({
            orderby: this.data.orderby == sort ? sort + 1 : sort
        })
        this.resetData();
    },
    //关键字写入
    setKeyword: function (event) {
        this.setData({
            keyword: event.detail.value
        })
    },
    //关键字搜索
    searchForm: function (event) {
        if (!this.data.keyword) { return false }
        this.setData({
            cate: ''
        })
        this.resetData();
    },
    //重置搜索条件
    resetData: function(){
        this.setData({
            pager: 1,
            goodslist: [],
            isload: false,
            nomore: false
        })
        this.getGoodsList();
    },
    //获取列表数据
    getGoodsList: function () {
        let data = {};
        if (this.data.isload) { return false; }
        if (this.data.nomore) { return false; }
        if (this.data.price_min < 0 || this.data.price_max < 0 || (this.data.price_min != '' && this.data.price_max != '' && this.data.price_min - 0 >= this.data.price_max - 0)) {
            wx.showToast({
                title: '价格区间错误',
                image: app.api.STATIC + 'images/error.png'
            })
            return false;
        }
        this.setData({
            screen: false,
            error: false,
            isload: true
        })
        if (this.data.keyword != '') {
            data.keyword = this.data.keyword
        }
        if (this.data.cate != '') {
            data.cate = this.data.cate
        }
        if (this.data.brand != '') {
            data.brand = this.data.brand
        }
        if (this.data.price_min != '') {
            data.price_min = this.data.price_min
        }
        if (this.data.price_max != '') {
            data.price_max = this.data.price_max
        }
        data.orderby = this.data.orderby;
        data.pager = this.data.pager;
        app.util.request({
            url: app.api.url.multiSearch(),
            data: data,
            success: res => {
                if (res.code == 1) {
                    let goodslist = this.data.goodslist.concat(res.data.goods),
                        nomore;
                    if (res.data.goods.length < 20) {
                        nomore = true;
                    }
                    this.setData({
                        goodslist: goodslist,
                        pager: this.data.pager + 1,
                        nomore: nomore,
                        img_url: res.data.img_url
                    })
                }
                this.setData({
                    isload: false
                })
                wx.hideToast();
            },
            fail: res => {
                wx.showToast({
                    title: res.msg,
                    image: app.api.STATIC + 'images/error.png'
                })
                this.setData({
                    error: true,
                    isload: false
                })
            }
        })
    },
    //改变样式
    changeStyle: function () {
        this.setData({
            style: this.data.style == 1 ? 0 : 1
        })
        wx.setStorage({
            key: "style",
            data: this.data.style
        })
    },
    chengesScreen: function(){
        this.setData({
            screen: !this.data.screen,
        })
    },
    //筛选功能
    checkCate: function (event) {
        this.setData({
            cate: event.currentTarget.dataset.cate,
        })
    },
    resetScreen: function () {
        this.setData({
            price_min: '',
            price_max: '',
            cate: ''
        })
    },
    getType: function () {
        app.util.request({
            url: app.api.url.getParent(),
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        typelist: res.data
                    })
                }
            }
        })
    },
    chengePrice: function (event) {
        let type = event.currentTarget.dataset.type,
            value = event.detail.value - 0;
        if (typeof value != 'number' || !value){
            value = '';
        }
        if (type == 'min'){
            this.setData({
                price_min: value
            })
        }else{
            this.setData({
                price_max: value
            })
        }
    },
    onShareAppMessage: function () {
    
    }
})