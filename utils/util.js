const api = require('./api');
//接口请求
let token = wx.getStorageSync('token');
const request = obj => {
    let data = obj.data || {};
    if (!token){
        token = wx.getStorageSync('token');
    }
    data.login_token = token;
    wx.request({
        url: obj.url,
        method: obj.type || 'POST',
        header: {
            'content-type': obj.type == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded'
        },
        dataType: obj.dataType || 'json',
        data: data,
        success: res => {
            if (res.data.code == 2001 || res.data.code == 2002) {
                login();
                return false;
            }
            if (res.data.code == 2003){
                //bindPhone();
                return false;
            }
            obj.success && typeof obj.success == 'function' && obj.success(res.data);
        },
        fail: res => {
            obj.fail && typeof obj.fail == 'function' && obj.fail(res.data);
        },
        complete: res => {
            obj.complete && typeof obj.complete == 'function' && obj.complete(res.data);
        }
    })
}
//登录
const login = () => {
    wx.login({
        success: res => {
            let code = res.code;
            wx.getSetting({
                success: (res) => {
                    if (res.authSetting['scope.userInfo'] == false){
                        wx.openSetting({
                            success: (res) => {
                                if (res.authSetting['scope.userInfo'] == false) {
                                    wx.showToast({
                                        title: '授权失败',
                                        image: '../../static/images/error.png'
                                    })
                                    setTimeout(() => {
                                        wx.switchTab({
                                            url: '/pages/index/index'
                                        })
                                    },1500)
                                }else{
                                    login();
                                }
                            }
                        })
                    }
                }
            })
            wx.getUserInfo({
                withCredentials: false,
                success: res => {
                    request({
                        url: api.url.login(),
                        data: {
                            code: code,
                            user_info: res.rawData,
                            terminal: 4
                        },
                        success: res => {
                            if (res.code == 1) {
                                wx.setStorage({
                                    key: 'token',
                                    data: res.data
                                })
                            } else {
                                wx.showToast({
                                    title: res.msg || '错误',
                                    image: api.STATIC + 'images/error.png'
                                })
                            }
                        }
                    })
                }
            })
        }
    })
}
//微信支付
const wecharPay = (option) => {
    request({
        url: api.url.openPay(),
        data: option,
        success: res => {
            if (res.code == 1) {
                wx.requestPayment({
                    timeStamp: res.data.info.time_stamp.toString(),
                    nonceStr: res.data.info.nonce_str,
                    package: res.data.info.package,
                    signType: 'MD5',
                    paySign: res.data.info.pay_sign,
                    success: res => {
                        wx.switchTab({
                            url: '/pages/order/pay_success?type_id=' + option.type_id + '&order_sn=' + option.order_sn
                        })
                    },
                    fail: res => {
                        console.log(res);
                    }
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
//链接提取
const getLink = (url) => {
    let pall = /(http|https)\:\/\/[\w\.]+(com|cn)/g;
    return url.replace(pall,'/pages')
}

//时间戳格式化
const formatDate = (time, form) => {
    let date = new Date(time * 1000),
        fmt = form || 'yyyy-MM-dd hh:mm:ss';
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
        }
    }
    return fmt;
}

module.exports = {
    request,
    login,
    wecharPay,
    getLink,
    formatDate,
    token
}