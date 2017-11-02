/**
 * 接口列表
 * 路径
 */
const HOST_URI = 'https://mall.new.upinkji.com/api/';
//const HOST_URI = 'http://new.upinkji.cc/api/';
const HOST_STATIC = 'https://mall.new.upinkji.com/';
const STATIC = '/static/';
let api = {
    //登录
    login: () => {
        return HOST_URI + 'wechat_small'
    },

    //首页
    index: () => {
        return HOST_URI + 'index'
    },

    //分类品牌
    category: () => {
        return HOST_URI + 'category/category_index'
    },
    getParent: () => {
        return HOST_URI + 'category/get_parent'
    },
    getBrand: () => {
        return HOST_URI + 'category/get_cate_brand'
    },

    //商品
    goodsDetail: () => {
        return HOST_URI + 'goods/get_detail'
    },
    collect: () => {
        return HOST_URI + 'goods/collect'
    },
    collectCancel: () => {
        return HOST_URI + 'goods/collect_cancel'
    },
    collectList: () => {
        return HOST_URI + 'goods/collect_list'
    },
    goodsSearch: () => {
        return HOST_URI + 'goods/search'
    },
    multiSearch: () => {
        return HOST_URI + 'goods/multi_search'
    },
    
    //购物车
    addCart: () => {
        return HOST_URI + 'cart/add_cart'
    },
    cartList: () => {
        return HOST_URI + 'cart/cart_list'
    },
    updateCart: () => {
        return HOST_URI + 'cart/update_cart'
    },
    delCart: () => {
        return HOST_URI + 'cart/del_cart'
    },

    //订单
    buyNow: () => {
        return HOST_URI + 'order/buy_now'
    },
    orderConfirm: () => {
        return HOST_URI + 'order/confirm'
    },
    orderSubmit: () => {
        return HOST_URI + 'order/submit'
    },
    submitDetail: () => {
        return HOST_URI + 'order/submit_detail'
    },
    getOrderBystate: () => {
        return HOST_URI + 'order/get_order_bystate'
    },
    cancelRemark: () => {
        return HOST_URI + 'order/cancel_remark'
    },
    changeStatus: () => {
        return HOST_URI + 'order/change_status'
    },
    getOrderDetail: () => {
        return HOST_URI + 'order/get_order_detail'
    },
    logistic: () => {
        return HOST_URI + 'order/logistic'
    },
    applyAfterSale: () => {
        return HOST_URI + 'order/apply_after_sale'
    },
    afterSale: () => {
        return HOST_URI + 'order/after_sale'
    },
    uploadImage: () => {
        return HOST_URI + 'order/upload_image'
    },

    //支付
    openPay: () => {
        return HOST_URI + 'pay/open_pay'
    },

    //支付成功返回
    getGeneralOrder: () => {
        return HOST_URI + 'pay_return/get_general_order'
    },

    //优惠卷
    userCoupon: () => {
        return HOST_URI + 'coupon/user_coupon'
    },

    //个人中心
    userInfo: () => {
        return HOST_URI + 'user/center'
    },

    //团购
    regiment: () => {
        return HOST_URI + 'goods/regiment'
    },
    regimentList: () => {
        return HOST_URI + 'goods/regiment_list'
    },
    regimentDetail: () => {
        return HOST_URI + 'goods/regiment_detail'
    },
    regimentConfirm: () => {
        return HOST_URI + 'order/regiment_confirm'
    },
    regimentSubmit: () => {
        return HOST_URI + 'order/regiment_submit'
    },
    joinRegiment: () => {
        return HOST_URI + 'order/join_regiment'
    },
    regimentOrder: () => {
        return HOST_URI + 'order/regiment_order'
    },

    //限时抢购
    flashSale: () => {
        return HOST_URI + 'goods/flash_sale'
    },
    flashSaleDetail: () => {
        return HOST_URI + 'goods/flash_sale_detail'
    },
    flashConfirm: () => {
        return HOST_URI + 'order/flash_confirm'
    },
    flashSubmit: () => {
        return HOST_URI + 'order/flash_submit'
    },

    //活动专区
    nationalPavilions: () => {
        return HOST_URI + 'country/national_pavilions'
    },
    todayNewGoods: () => {
        return HOST_URI + 'goods/today_new_goods'
    },
    goodGoods: () => {
        return HOST_URI + 'goods/good_goods'
    },
    hotSales: () => {
        return HOST_URI + 'goods/hot_sales'
    },
    zone: () => {
        return HOST_URI + 'goods/zone'
    },
}


module.exports = {
    url: api,
    HOST_URI,
    HOST_STATIC,
    STATIC
}
