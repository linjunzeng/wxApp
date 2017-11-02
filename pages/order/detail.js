// pages/order/detail.js
const app = getApp();
Page({
    data: {
        goods: [],
        payinfo: {},
        address: {},
        img_url: '',
        show: false,
        remark: 0,
        remarkList: [],
        order_sn: '',
        timeDate: '',
        order_time: ''
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            order_sn: options.order_sn
        })
        this.getdetail()
    },
    getdetail: function () {
        app.util.request({
            url: app.api.url.getOrderDetail(),
            data: {
                order_sn: this.data.order_sn
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        goods: res.data.goods,
                        payinfo: res.data.pay,
                        address: res.data.address,
                        img_url: res.data.img_url,
                        order_time: app.util.formatDate(res.data.pay.order_time)
                    })
                    if (res.data.pay.countdown > 0){
                        this.countdown();
                    }
                    wx.hideToast();
                }else{
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                    setTimeout(()=>{
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                    }, 1500)
                }
            }
        })
    },
    //倒计时
    countdown: function(){
        let payinfo = this.data.payinfo,
            time = setTimeout(() => {
                payinfo.countdown -= 1;
                let dd = Math.floor(payinfo.countdown / (3600*24)),
                    hh = Math.floor((payinfo.countdown) / 3600) - dd * 24,
                    mm = Math.floor((payinfo.countdown) / 60) - dd * 24 * 60 - hh * 60,
                    ss = payinfo.countdown - dd * 24 * 3600 - hh * 3600 - mm * 60;
                this.setData({
                    payinfo,
                    timeDate: dd + ' 天 ' + hh + ' 时 ' + mm + ' 分 ' + ss + ' 秒 '
                })
                if (payinfo.countdown > 0){
                    this.countdown();
                }
            }, 1000);
    },
    //打开弹窗
    modelShow: function () {
        if (this.data.remarkList.length == 0) {
            app.util.request({
                url: app.api.url.cancelRemark(),
                success: res => {
                    if (res.code == 1) {
                        this.setData({
                            remarkList: res.data.remark,
                            show: true
                        })
                    }
                }
            })
        } else {
            this.setData({
                show: true
            })
        }
    },
    //关闭弹窗
    closeModel: function () {
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
        wx.showModal({
            title: '确认操作',
            content: '请在收到货，验货之后确实货对版，货物无损在点击确认收货',
            success: res => {
                if (res.confirm) {
                    this.handle(40)
                }
            }
        })
    },
    //延长收货
    delay: function (event) {
        wx.showModal({
            title: '确认操作',
            content: '因特殊原因没收到货物,延迟七天收货',
            success: res => {
                if (res.confirm) {
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
                        wx.redirectTo({
                            url: '/pages/order/detail?order_sn=' + this.data.order_sn
                        })
                    }, 1500)
                } else {
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                }
            }
        })
    },
    refund: function (event) {
        let key = event.currentTarget.dataset.key - 0;
        console.log(this.data.goods[key].gid)
        wx.navigateTo({
            url: './apply_after_sale?gid=' + this.data.goods[key].gid
        })
    },
    onShareAppMessage: function () {
    
    }
})