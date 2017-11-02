// pages/index/member.js
const app = getApp();
Page({
    data: {
        memberdata: {},
    },
    onLoad: function () {
       
    },
    onShow: function(){
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.getUser();
    },
    getUser: function () {
        app.util.request({
            url: app.api.url.userInfo(),
            success: res => {
                if (res.code == 1) {
                    let memberdata = res.data;
                    for (let i in memberdata){
                        if (memberdata[i].icon){
                            memberdata[i].icon = 'icon-'+memberdata[i].icon.substr(3, 4);
                        }
                        for (let j in memberdata[i].content) {
                            if (memberdata[i].content[j].title == '招商加盟'){
                                memberdata[i].content[j] = '';
                            }else{
                                memberdata[i].content[j].icon = 'icon-' + memberdata[i].content[j].icon.substr(3, 4);
                            }
                        }
                    }
                    console.log(memberdata)
                    this.setData({
                        memberdata: memberdata
                    })
                    wx.hideToast();
                }else{
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                }
            }
        })
    },
    navgate: function (event) {
        let url = app.util.getLink(event.currentTarget.dataset.url);
        if (url){
            wx.navigateTo({
                url: url
            })
        }
    },
    onShareAppMessage: function () {
    
    }
})