//app.js
const util = require('./utils/util');
const api = require('./utils/api');
App({
    onLaunch: function () {
        wx.getStorage({
            key: 'token',
            success: (res) => {
                //this.token = res.data;
            }
        })
    },
    util,
    api
})