// pages/member/manual.js
const app = getApp()
const advisory = require('../../static/js/advisory.js').advisory;
Page({
    data: {
        advisory: {},
        mold: 'mayi',
        type: '',
        titleArr: ['蚂蚁操作手册', '帮助与客服', '关于我们'],
        img_url: app.api.HOST_STATIC
    },
    onLoad: function (options) {
        let type = options.type || 1;
        for (let i in advisory.question){
            advisory.question[i].icon = 'icon-' + advisory.question[i].icon.substr(3, 4);
        }
        for (let i in advisory.mayi) {
            advisory.mayi[i].icon = 'icon-' + advisory.mayi[i].icon.substr(3, 4);
        }
        wx.setNavigationBarTitle({
            title: this.data.titleArr[type - 1]
        })
        this.setData({
            type: type,
            mold: type != 2 ? 'mayi' : 'question',
            advisory: advisory
        })
    },
    onShareAppMessage: function () {

    }
})