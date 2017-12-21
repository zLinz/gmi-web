/*! functions.js */

/**
 * 登录页面加载js
 *
 */
var Host = require('tool/host');
var Global = require('tool/global');
var User = require('tool/Userinfo');

$(function() {

    $.ajax({
        url: Host.rcmain + Host.interface.user.login,
        type: 'post',
        data: "openid=" + User.openid,
        success: function(res) {
            if (res.result) {
                console.log(res);

                var curuser = new Object();

                curuser.id = res.data.id;
                curuser.username = res.data.username;
                curuser.realname = res.data.realname;
                curuser.openid = res.data.openid;
                curuser.phone = res.data.phone;
                curuser.grade = res.data.grade;
                curuser.dorm = res.data.dorm;
                curuser.headimgurl = res.data.headImg;

                var userobject = JSON.stringify(curuser);
                sessionStorage.setItem('curuser', userobject);

                location.href = Global.index.url;
            } else {
                // $.showBXAlert('错误原因:' + res.reason, null);
                location.href = Global.index.url;
            }
        },
        error: function(err) {
            location.href = Global.index.url;
            // $.showBXAlert('请求出错，请稍候重试！', null);
            console.log(err);
        }
    });

});