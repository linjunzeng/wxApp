// pages/order/apply_after_sale.js
const app = getApp();
Page({
    data: {
        goods: [],
        reason: [],
        imgList: [],
        imgArr: [],
        sale_type: '62',
        text_str: '',
        reason_key: -1,
        show: false
    },
    onLoad: function (options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.setData({
            gid: options.gid
        })
        this.getdetail();
    },
    getdetail: function () {
        app.util.request({
            url: app.api.url.applyAfterSale(),
            data: {
                gid: this.data.gid
            },
            success: res => {
                if (res.code == 1) {
                    this.setData({
                        goods: res.data.goods,
                        reason: res.data.reason,
                        order_status: res.data.order_status,
                        sale_type: res.data.order_status == 20 ? '63':'62',
                    })
                    wx.hideToast();
                } else {
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                }
            }
        })
    },
    changType: function(event){
        this.setData({
            sale_type: event.currentTarget.dataset.type
        })
    },
    modelShow: function(){
        this.setData({
            show: !this.data.show
        })
    },
    chengCheck: function (event) {
        this.setData({
            reason_key: event.currentTarget.dataset.key
        })
    },
    setText: function (event) {
        this.setData({
            text_str: event.detail.value
        })
    },
    change_status: function(){
        if (this.data.reason_key == -1) {
            wx.showToast({
                title: '请选择原因',
                icon: 'loading'
            })
            return false;
        }
        app.util.request({
            url: app.api.url.afterSale(),
            data: {
                status: this.data.sale_type,
                reason: this.data.reason_key,
                describe: this.data.text_str,
                gid: this.data.goods.gid,
                type: 1,
                images: this.data.imgArr.toString()
            },
            success: res => {
                if (res.code == 1) {
                    wx.navigateBack({
                        delta: 1
                    })
                    wx.hideToast();
                } else {
                    wx.showToast({
                        title: res.msg,
                        image: app.api.STATIC + 'images/error.png'
                    })
                }
            }
        })
    },
    fileImg: function(){
        wx.chooseImage({
            count: 1,
            sizeType: 'compressed',
            success: res => {
                wx.uploadFile({
                    url: app.api.url.uploadImage(),
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    formData: {
                        login_token: app.util.token
                    },
                    success: res1 => {
                        let data = JSON.parse(res1.data);
                        console.log(data.data)
                        wx.showToast({
                            title: '上传中',
                            icon: 'loading',
                            duration: 10000
                        })
                        if (data.code == 1) {
                            let imgList = this.data.imgList.concat(res.tempFilePaths);
                            this.setData({
                                imgList: imgList,
                                imgArr: this.data.imgArr.concat(data.data)
                            })
                            wx.hideToast();
                        } else {
                            wx.showToast({
                                title: '上传失败',
                                image: app.api.STATIC + 'images/error.png'
                            })
                        }
                    }
                })
            }
        })  
    },
    delImg: function (event){
        let key = event.currentTarget.dataset.key,
            imgList = this.data.imgList,
            imgArr = this.data.imgArr;
        imgList.splice(key, 1);
        imgArr.splice(key, 1);
        this.setData({
            imgList: imgList,
            imgArr: imgArr
        })
    },
    onShareAppMessage: function () {

    }
})