// pages/regiment/success.js
const app = getApp();
Page({
    data: {
        detail: null,
        downtime: '',
        order_sn: '',
        order_item: ''
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            order_sn: options.order_sn || '200150943593574630'
        })
        this.getInfo();
    },
    getInfo: function () {
        app.util.request({
            url: app.api.url.regimentOrder(),
            data: {
                order_sn: this.data.order_sn
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        detail: res.data,
                        order_item: app.util.formatDate(res.data.order.regiment_time)
                    })
                    if (res.data.countdown > 0) {
                        this.countdown(res.data.countdown)
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