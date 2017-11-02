// pages/member/detail.js
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const advisory = require('../../static/js/advisory.js').advisory;
Page({
    data: {
        advisory,
        type: '',
        detail: '',
        isshow: false,
        wechatkey: 0,
        titleArr: ['问答详情', '在线咨询', '客服电话', '公司简介', '联系方式', '合作伙伴'],
        img_url: app.api.HOST_STATIC
    },
    onLoad: function (options) {
        let type, detail;
        type = options.type;
        wx.setNavigationBarTitle({
            title: this.data.titleArr[type - 1]
        })
        if (options.info) {
            let infoarr = options.info.split(',');
            detail = this.data.advisory[infoarr[0]][infoarr[1]].list[infoarr[2]];
            WxParse.wxParse('detail_info', 'html', detail.answer, this, 30);
        }	
        this.setData({
            detail,
            type
        })
    },
    wechatShow: function (event) {
        this.setData({
            isshow: true,
            wechatkey: event.currentTarget.dataset.key,
        })
    },
    closeModel: function(){
        this.setData({
            isshow: false
        })
    },
    onShareAppMessage: function () {
    
    }
})