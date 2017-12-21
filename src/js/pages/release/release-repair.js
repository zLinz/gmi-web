
var Host = require('tool/host');
var Global = require('tool/global');
var Vue = require('vue/vue.min.js');
var User = require('tool/Userinfo');

$(function() {

    var $releasebtn = $('.release-btn');
    var $backbtn = $('.back-button');
    var $form = $('#form');
    var curuser = sessionStorage.getItem('curuser');
    if(curuser == null){
        $.showBXAlert('登录失效，请重新登录！', null);
        location.href = Global.login.url;
    }
    curuser = JSON.parse(curuser);



    var $typeinput = $('#input-workertype');
    $.ajax({
        url: Host.rcmain + Host.interface.worker.type,
        type: 'post',
        data: "token=" + curuser.token,
        success: function (res) {
            if (res.result) {
                console.log(res.data);
                $.each(res.data, function (key, value) {
                    $typeinput
                        .append($("<option></option>")
                            .attr("value", value)
                            .text(value));
                });
            } else {
                $.showBXAlert('错误原因:' + res.reason, null, function () {
                    if (res.tologin) {
                        location.href = Global.login.url;
                    }
                });
            }
        },
        error: function (err) {
            $.showBXAlert('请求出错，请稍候重试！', null);
            console.log(err);
        }
    });

    $backbtn.click(function() {

        bootbox.confirm({
            message: "你还未发表报修信息，确定退出么？",
            buttons: {
                confirm: {
                    label: '确定',
                    className: 'btn-success'
                },
                cancel: {
                    label: '取消',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result) {
                    history.go(-1);
                }
            }
        });

    });


    $releasebtn.click(function() {
        var that = $(this);
        that.attr('disabled', 'disabled');
        var $title = $('input[name=title]').val();
        var $content = $('#input-repair-content').val();
        var $address = $('input[name=address]').val();


        if(!$title) {
            that.removeAttr('disabled');
            $.showBXAlert('标题不能为空!', null);
        } else if (!$content) {
            that.removeAttr('disabled');
            $.showBXAlert('内容不能为空!', null);
        } else if (!$address) {
            that.removeAttr('disabled');
            $.showBXAlert('地址不能为空！', null);
        } else {
            var dialog = bootbox.dialog({
                message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在加载中...</p>',
                closeButton: false,
                animate: false
            });
            var userid = JSON.parse(sessionStorage.getItem('curuser')).id;
            $.ajax({
                url: Host.rcmain + Host.interface.repair.add,
                type: 'post',
                data: decodeURIComponent($form.serialize()) + "&author=" + userid + "&token=" + curuser.token,
                success: function(res) {
            that.removeAttr('disabled');
                    dialog.modal('hide');
                    if (res.result) {
                        $.showBXAlert('发布成功！', null);
                        location.href = Global.repair.url;
                    } else {
                              $.showBXAlert('请求出错，原因：' + res.reason, null, function(){
                                if(res.tologin){
                                    location.href = Global.login.url;
                                }
                            });
                    }
                },
                error: function(err) {
            that.removeAttr('disabled');
                    dialog.modal('hide');
                    $.showBXAlert('请求出错，请稍后尝试！', null);
                }
            });
        }

    });


});
