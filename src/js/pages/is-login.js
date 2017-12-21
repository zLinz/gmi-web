/*! functions.js */

/**
 * 主页面加载的js
 *
 */
var Global = require('tool/global');
var Host = require('tool/host');
var User = require('tool/Userinfo');

$(function () {
    console.log(location.href);
    if (sessionStorage.getItem('curuser') != null) {
        console.log('Aleady have user.');
    } else {
        location.href = Global.login.url;
    }

});