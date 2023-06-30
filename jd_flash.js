// ==UserScript==
// @name         jd抢购
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       寻步
// @match        https://item.jd.com/*
// @match        https://cart.jd.com/*
// @match        https://trade.jd.com/shopping/order/getOrderInfo.action
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
//https://item.jd.com/{itemId}.html

// let itemId=100050901790

let itemId=100052940701//输入物品id
//抢购时间
let time=new Date()
time.setHours(24)//在今天几点钟抢票（明天0点则写24）
time.setMinutes(0)//在今天几分钟抢票
time.setSeconds(0)
time.setMilliseconds(0)

if (window.location.href===`https://item.jd.com/${itemId}.html`){
    //商品页
    console.log("在商品页");
    let now;
    let timer=setInterval(
        ()=>{
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://sgm-m.jd.com/h5/",
                headers: {
                    "Content-Type": "application/json"
                  },
                onload: function(response) {
                    now=new Date(response.responseHeaders.match(/date: (.+?)[\n\r]/)[1]);
                }
            });
            if(time-now<=0){
                clearInterval(timer)
                window.location.href=`//cart.jd.com/gate.action?pid=${itemId}&pcount=1&ptype=1`
            }else{
                console.log(`时间还差${(time-now)/1000}秒`)
            }
        },200
    )

}else if (window.location.href.startsWith(`https://cart.jd.com/addToCart.html`) && window.location.href.includes(`${itemId}`)){
//已加入购物车
        console.log("已加入购物车");
        window.onload=()=>{window.location.href=`https://cart.jd.com/cart_index`}
}else if(window.location.href===`https://cart.jd.com/cart_index`){
    //购物车界面
    window.onload=()=>{
        let btn=document.querySelector("#cart-body > div:nth-child(2) > div:nth-child(26) > div > div.cart-floatbar.cart-floatbar-fixed > div > div > div > div.options-box > div.right > div > div.btn-area > a")
        btn.click()
    }
}else if(window.location.href===`https://trade.jd.com/shopping/order/getOrderInfo.action`){
    //结算页面
    window.onload=()=>{
        console.log("结算");
        let btn=document.querySelector("#order-submit")
        btn.click()
    }
}
})();