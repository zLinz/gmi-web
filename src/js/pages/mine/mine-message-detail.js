
var Host = require('tool/host');
var Global = require('tool/global');
var Vue = require('vue/vue.min.js');
var User = require('tool/Userinfo');

$(function() {

    var minemessageoffset = 0;
    var minemessagelimit = 5;
    var minemessageloadtime = 0;
    var minemessageifload = false;
    var minemessagehasmore = true;
    var minemessagetype = "";
    var minemessageorder = "desc";
    sessionStorage.setItem('minemessagetype', "");
    sessionStorage.setItem('minemessageorder', "desc");
    var curuser = sessionStorage.getItem('curuser');
    if(curuser == null){
        $.showBXAlert('登录失效，请重新登录！', null);
        location.href = Global.login.url;
    }
    curuser = JSON.parse(curuser);
    //屏幕滚动式的监听事件，实现导航的浮动
    $(window).scroll(function() {
        var bodyScrollTop = document.body.scrollTop;

            if ((!minemessagehasmore) || ($(window).scrollTop() > ($('.load-more-box').offset().top + $('.load-more-box').outerHeight())) || (($(window).scrollTop() + $(window).height()) < ($('.load-more-box').offset().top + $('.footer-tabs').outerHeight()))) {
            console.log("不加载minemessage");
        } else {
            if (!minemessageifload) {
                console.log("加载minemessage");
                loadmoreminemessage();
            } else {
                console.log("正在加载minemessage...");
            }
        }
    });

    loadmoreminemessage();

    var minemessageItemArray = [];

    $('select[name=minemessagetype]').change(function() {
        if( sessionStorage.getItem('minemessagetype') != $(this).val() ) {
            $('.load-more').text('加载中....');
            $('.load-icon').show();
            minemessagehasmore = true;
            minemessageItemArray.splice(0,minemessageItemArray.length);
        }
        sessionStorage.setItem('minemessagetype', $(this).val());
        initminemessage();
    });

    $('select[name=minemessageorder]').change(function() {
        if( sessionStorage.getItem('minemessageorder') != $(this).val() ) {
            $('.load-more').text('加载中....');
            $('.load-icon').show();
            minemessagehasmore = true;
            minemessageItemArray.splice(0,minemessageItemArray.length);
        }
        sessionStorage.setItem('minemessageorder', $(this).val());
        initminemessage();
    });

    function initminemessage() {
        minemessageoffset = 0;
        minemessagelimit = 5;
        minemessageloadtime = 0;
        minemessagehasmore = true;
        minemessageItemArray.length = 0;
        console.log(minemessageItemArray);
        loadmoreminemessage();
    }

    // 维修页面内容
    var minemessageItem = new Vue({
        el: '#mine-message-card-item',
        data: function() {
            return {
                datas: minemessageItemArray
            };
        },
        methods: {
        	checkout: function(minemessageID) {
        		location.href = Global.message.detail + "#" + minemessageID;
        	},
            deleteitem: function(minemessageID) {
                bootbox.confirm({
                    message: "你确定要删除此条留言消息么？",
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
                        var dialog = bootbox.dialog({
                            message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在处理中...</p>',
                            closeButton: false,
                            animate: false
                        });
                        console.log('This was logged in the callback: ' + result);
                        if(result) {
                            $.ajax({
                                url: Host.rcmain + Host.interface.minemessage.deletemessage(minemessageID),
                                type: 'post',
                                data: 'id=' + minemessageID + "&token=" + curuser.token,
                                success: function(res) {
                                    dialog.modal('hide');
                                    if(res.result) {
                                        location.reload();
                                    } else {
                                        $.showBXAlert('请求出错，请稍候重试！', null, function () {
                                    if (res.tologin) {
                                        location.href = Global.login.url;
                                    }
                                });
                                    }
                                },
                                error: function(err) {
                                    dialog.modal('hide');
                                    $.showBXAlert('请求出错，请稍候重试！', null);
                                    console.log(err);
                                }
                            });
                        } else {
                            dialog.modal('hide');
                        }
                    }
                });
            }
        }
    });

    function loadmoreminemessage() {
        minemessageoffset = minemessageloadtime * minemessagelimit;
        minemessageifload = true;

        if(sessionStorage.getItem('minemessagetype') != null) {
            minemessagetype = sessionStorage.getItem('minemessagetype');
        }
        if(sessionStorage.getItem('minemessageorder') != null) {
            minemessageorder = sessionStorage.getItem('minemessageorder');
        }

        console.log(minemessagetype);
        console.log(minemessageorder);
        var userid = JSON.parse(sessionStorage.getItem('curuser')).id;
        $.ajax({
            url: Host.rcmain + Host.interface.minemessage.query,
            type: 'post',
            data: "offset=" + minemessageoffset + "&limit=" + minemessagelimit + "&type=" + minemessagetype + "&order=" + minemessageorder + "&author=" + userid + "&token=" + curuser.token,
            success: function(res) {
                if (res.result) {
                    minemessageloadtime++;
                    console.log(res);
                    if (res.data.length <= 0) {
                        minemessageifload = false;
                        console.log('no more data!');
                        minemessagehasmore = false;
                        $('.load-more').text('没有数据了');
                        $('.load-icon').hide();
                    } else {
                        res.data.forEach(function(item) {
                            let minemessageObject = new Object();
                            minemessageObject.minemessageID = item.id;
                            minemessageObject.minemessageAuthorName = item.author.realname;
                            minemessageObject.minemessageTitle = item.title;
                            minemessageObject.minemessageContent = item.content;
                            minemessageObject.minemessageDate = item.createdAt;
                            minemessageObject.minemessageType = item.type;
                            minemessageObject.minemessageStatus = item.status;
                            minemessageObject.minemessageAuthorImg = item.author.headImg;
                            if (item.status == "已答复") {
                                minemessageObject.minemessageReplyContent = item.reply.content;
                            }
                            minemessageItemArray.push(minemessageObject);
                        });
                        minemessageifload = false;
                        if (res.data.length <= 4) {
                            console.log('没有数据了');
                            $('.load-more').text('没有数据了');
                            $('.load-icon').hide();
                            minemessagehasmore = false;
                        }
                    }

                } else {
                    minemessageifload = false;
                    minemessagehasmore = false;
                    $.showBXAlert('错误原因:' + res.reason, null, function () {
                                    if (res.tologin) {
                                        location.href = Global.login.url;
                                    }
                                });
                    console.log('没有数据了');
                    $('.load-more').text('没有数据了');
                    $('.load-icon').hide();
                }
            },
            error: function(err) {
                minemessageifload = false;
                minemessagehasmore = false;
                $.showBXAlert('请求出错，请稍候重试！', null);
                console.log('没有数据了');
                $('.load-more').text('没有数据了');
                $('.load-icon').hide();
                console.log(err);
            }
        });
    }

});
