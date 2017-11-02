// pages/order/list.js
const app = getApp()
Page({
    data: {
        order_list: [],
        statusArr: {},
        img_url: '',
        isload: false,
        nomore: false,
        error: false,
        status: '',
        page: 1,
        order_sn: '',
        show: false,
        key: 0,
        remark: 0,
        remarkList: []
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            status: options.status || 0
        })
        this.getOrder();
    },
    onReachBottom: function () {
        this.getOrder();
    },
    init: function () {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            page: 1,
            isload: false,
            nomore: false,
            order_list: []
        })
        this.getOrder();
    },
    getOrder: function () {
        if (this.data.isload) { return false; }
        if (this.data.nomore) { return false; }
        this.setData({
            error: false,
            isload: true
        })
        app.util.request({
            url: app.api.url.getOrderBystate(),
            data: {
                status: this.data.status,
                page: this.data.page
            },
            success: res => {
                if (res.code == 1) {
                    if (res.code == 1) {
                        let order_list = this.data.order_list.concat(res.data.order);
                        this.setData({
                            order_list: order_list,
                            statusArr: res.data.status,
                            img_url: res.data.img_url,
                            page: this.data.page++,
                            nomore: res.data.order.length < 10 ? true : false,
                            isload: false
                        })
                    }
                    wx.hideToast();
                }else{
                    this.setData({
                        error: false,
                        isload: true
                    })
                }
            }
        })
    },
    //打开弹窗
    modelShow: function (event) {
        let key = event.currentTarget.dataset.key, 
            order_sn = event.currentTarget.dataset.ordersn;
        console.log(event)
        if (this.data.remarkList.length == 0) {
            app.util.request({
                url: app.api.url.cancelRemark(),
                success: res => {
                    if (res.code == 1) {
                       this.setData({
                            remarkList: res.data.remark,
                            show: true,
                            order_sn: order_sn,
                            key: key,
                        })
                    }
                }
            })
        }else {
            this.setData({
                show: true,
                order_sn: order_sn,
                key: key,
            })
        }
    },
    //关闭弹窗
    closeModel: function(){
        this.setData({
            show: false
        })
    },
    check: function (event) {
        this.setData({
            remark: event.currentTarget.dataset.key
        })
    },
    //取消订单
    cancel: function () {
        this.setData({
            show: false
        })
        this.handle(70);
    },
    //确认收货
    receipt: function (event) {
        let key = event.currentTarget.dataset.key,
            order_sn = event.currentTarget.dataset.ordersn;
        wx.showModal({
            title: '确认操作',
            content: '请在收到货，验货之后确实货对版，货物无损在点击确认收货',
            success: res => {
                if (res.confirm){
                    this.setData({
                        order_sn: order_sn,
                        key: key
                    })
                    this.handle(40)
                }
            }
        })
    },
    //延长收货
    delay: function (event) {
        let key = event.currentTarget.dataset.key,
            order_sn = event.currentTarget.dataset.ordersn;
        wx.showModal({
            title: '确认操作',
            content: '因特殊原因没收到货物,延迟七天收货',
            success: res => {
                if (res.confirm) {
                    this.setData({
                        order_sn: order_sn,
                        key: key
                    })
                    this.handle(31)
                }
            }
        })
    },
    handle: function (status) {
        let data = {
            status: status,
            order_sn: this.data.order_sn
        }
        if (status == 70) {
            data.remark = this.data.remark
        }
        app.util.request({
            url: app.api.url.changeStatus(),
            data: data,
            success: res => {
                if (res.code == 1) {
                    wx.showToast({
                        title: res.msg,
                        icon: 'success'
                    })
                    setTimeout(() => {
                        if (status == 31 || status == 70) {
                            this.init();
                        } else {
                            let order_list = this.data.order_list;
                            order_list.splice(this.data.key, 1);
                            this.setData({
                                order_list: order_list
                            })
                        }
                    }, 1500)
                }else{
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