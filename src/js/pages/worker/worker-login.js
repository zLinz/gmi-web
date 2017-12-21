/*! functions.js */

/**
 * 登录页面加载js
 *
 */
var Host = require('tool/host');
var Global = require('tool/global');
var User = require('tool/Userinfo');

$(function () {
    var $loginbtn = $('.login-btn');
    var $form = $('#form');

    //格式化电话初始化
    $(":input").inputmask();
    $loginbtn.click(function () {

        var that = $(this);

        that.attr('disabled', 'disabled');

        var $name = $('input[name=name]').val();
        var $phone = $('input[name=phone]').val();

        if (!$name) {
            that.removeAttr('disabled');
            $.showBXAlert('姓名不能为空！', null);
        } else if (!$phone || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test($phone))) {
            that.removeAttr('disabled');
            $.showBXAlert('手机号不能为空或者格式不正确!', null);
        } else {
            var dialog = bootbox.dialog({
                message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在加载中...</p>',
                closeButton: false,
                animate: false
            });
            $.ajax({
                url: Host.rcmain + Host.interface.worker.login,
                type: 'post',
                data: decodeURIComponent($form.serialize()) + "&openid=" + User.openid,
                success: function (res) {
                    that.removeAttr('disabled');
                    dialog.modal('hide');
                    if (res.result) {
                        console.log(res);

                        var worker = new Object();

                        worker.id = res.data.id;
                        worker.type = res.data.type;
                        worker.phone = res.data.phone;
                        worker.openid = res.data.openid;

                        var userobject = JSON.stringify(worker);
                        sessionStorage.setItem('worker', worker);

                        location.href = Global.worker.query;
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