/*! functions.js */

/**
 * 登录页面加载js
 *
 */
var Host = require('tool/host');
var Global = require('tool/global');
var User = require('tool/Userinfo');

$(function () {
    var $registerbtn = $('.go-register');
    var $loginbtn = $('.login-btn');
    var $form = $('#form');

    $registerbtn.click(function () {
        location.href = Global.login.register;
    });

    // $.ajax({
    //     url: Host.rcmain + Host.interface.user.getUsernameByOpenid,
    //     type: 'post',
    //     data: "openid=" + User.openid,
    //     success: function (res) {
    //         if (res.result) {
    //             console.log(res);

    //             var curuser = new Object();

    //             curuser.id = res.data.id;
    //             curuser.username = res.data.username;
    //             curuser.realname = res.data.realname;
    //             curuser.openid = res.data.openid;
    //             curuser.phone = res.data.phone;
    //             curuser.grade = res.data.grade;
    //             curuser.dorm = res.data.dorm;
    //             curuser.token = res.data.token;
    //             curuser.headimgurl = res.data.headImg;

    //             var userobject = JSON.stringify(curuser);
    //             sessionStorage.setItem('curuser', userobject);

    //             location.href = Global.index.url;

    //         }
    //     },
    //     error: function (err) {}
    // });


    $loginbtn.click(function () {

        var that = $(this);

        that.attr('disabled', 'disabled');

        var $username = $('input[name=username]').val();
        var $password = $('input[type=password]').val();

        if (!$username) {
            that.removeAttr('disabled');
            $.showBXAlert('学号不能为空！', null);
        } else {
            var dialog = bootbox.dialog({
                message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在加载中...</p>',
                closeButton: false,
                animate: false
            });
            $.ajax({
                url: Host.rcmain + Host.interface.user.login,
                type: 'post',
                data: decodeURIComponent($form.serialize()) + "&password=" + $.md5(Host.salt + $password) + "&openid=" + User.openid,
                success: function (res) {
                    that.removeAttr('disabled');
                    dialog.modal('hide');
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
                        curuser.token = res.data.token;
                        curuser.headimgurl = res.data.headImg;

                        var userobject = JSON.stringify(curuser);
                        sessionStorage.setItem('curuser', userobject);

                        location.href = Global.index.url;
                    } else {
                        $.showBXAlert('错误原因:' + res.reason, null);
                    }
                },
                error: function (err) {
                    that.removeAttr('disabled');
                    dialog.modal('hide');
                    $.showBXAlert('请求出错，请稍候重试！', null);
                    console.log(err);
                }
            });
        }
    });

});