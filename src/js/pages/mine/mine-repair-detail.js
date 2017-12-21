
var Host = require('tool/host');
var Global = require('tool/global');
var Vue = require('vue/vue.min.js');
var User = require('tool/Userinfo');

$(function() {

    var minerepairoffset = 0;
    var minerepairlimit = 5;
    var minerepairloadtime = 0;
    var minerepairifload = false;
    var minerepairhasmore = true;
    var minerepairstatus = "";
    var minerepairorder = "desc";
    sessionStorage.setItem('minerepairstatus', "");
    sessionStorage.setItem('minerepairorder', "desc");
    var curuser = sessionStorage.getItem('curuser');
    if(curuser == null){
        $.showBXAlert('登录失效，请重新登录！', null);
        location.href = Global.login.url;
    }
    curuser = JSON.parse(curuser);
    //屏幕滚动式的监听事件，实现导航的浮动
    $(window).scroll(function() {
        var bodyScrollTop = document.body.scrollTop;

        if ((!minerepairhasmore) || ($(window).scrollTop() > ($('.load-more-box').offset().top + $('.load-more-box').outerHeight())) || (($(window).scrollTop() + $(window).height()) < ($('.load-more-box').offset().top + $('.footer-tabs').outerHeight()))) {
            console.log("不加载mine");
        } else {
            if (!mineifload) {
                console.log("加载mine");
                loadmoremine();
            } else {
                console.log("正在加载mine...");
            }
        }

    });

    loadmoreminerepair();
    var minerepairItemArray = [];
    $('select[name=minerepairstatus]').change(function() {
        if( sessionStorage.getItem('minerepairstatus') != $(this).val() ) {
            $('.load-more').text('加载中....');
            $('.load-icon').show();
            minerepairhasmore = true;
            minerepairItemArray.splice(0,minerepairItemArray.length);
        }
        sessionStorage.setItem('minerepairstatus', $(this).val());
        initminerepair();
    });

    $('select[name=minerepairorder]').change(function() {
        if( sessionStorage.getItem('minerepairorder') != $(this).val() ) {
            $('.load-more').text('加载中....');
            $('.load-icon').show();
            minerepairhasmore = true;
            minerepairItemArray.splice(0,minerepairItemArray.length);
        }
        sessionStorage.setItem('minerepairorder', $(this).val());
        initminerepair();
    });




    function initminerepair() {
        minerepairoffset = 0;
        minerepairlimit = 5;
        minerepairloadtime = 0;
        minerepairhasmore = true;
        minerepairItemArray.length = 0;
        console.log(minerepairItemArray);
        loadmoreminerepair();
    }

    // 维修页面内容
    var minerepairItem = new Vue({
        el: '#mine-repair-card-item',
        data: function() {
            return {
                datas: minerepairItemArray
            };
        },
        methods: {
        	checkout: function(minerepairID) {
        		location.href = Global.repair.detail + "#" + minerepairID;
        	},
            deleteitem: function(minerepairID) {
                bootbox.confirm({
                    message: "你确定要删除此条报修消息么？",
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
                        var dialog = bootbox.dialog({
                            message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在处理中...</p>',
                            closeButton: false,
                            animate: false
                        });
                        console.log('This was logged in the callback: ' + result);
                        if(result) {
                            $.ajax({
                                url: Host.rcmain + Host.interface.minerepair.deleterepair(minerepairID),
                                type: 'post',
                                data: 'id=' + minerepairID + "&token=" + curuser.token,
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
            },
            complete: function(minerepairID){
                bootbox.confirm({
                    message: "你确定要完成此条报修消息么？",
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
                        var dialog = bootbox.dialog({
                            message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在处理中...</p>',
                            closeButton: false,
                            animate: false
                        });
                        console.log('This was logged in the callback: ' + result);
                        if(result) {
                            $.ajax({
                                url: Host.rcmain + Host.interface.minerepair.complete(minerepairID),
                                type: 'post',
                                data: 'id=' + minerepairID + "&token=" + curuser.token,
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

    function loadmoreminerepair() {

        minerepairoffset = minerepairloadtime * minerepairlimit;
        minerepairifload = true;

        if(sessionStorage.getItem('minerepairstatus') != null) {
            minerepairstatus = sessionStorage.getItem('minerepairstatus');
        }
        if(sessionStorage.getItem('minerepairorder') != null) {
            minerepairorder = sessionStorage.getItem('minerepairorder');
        }

        console.log(minerepairstatus);
        console.log(minerepairorder);
        var userid = JSON.parse(sessionStorage.getItem('curuser')).id;
        $.ajax({
            url: Host.rcmain + Host.interface.minerepair.query,
            type: 'post',
            data: "offset=" + minerepairoffset + "&limit=" + minerepairlimit + "&status=" + minerepairstatus + "&order=" + minerepairorder + "&author=" + userid + "&token=" + curuser.token,
            success: function(res) {
                if (res.result) {
                    minerepairloadtime++;
                    console.log(res);
                    if (res.data.length <= 0) {
                        minerepairifload = false;
                        console.log('no more data!');
                        minerepairhasmore = false;
                        $('.load-more').text('没有数据了');
                        $('.load-icon').hide();
                    } else {
                        res.data.forEach(function(item) {
                            let minerepairObject = new Object();
                            minerepairObject.minerepairID = item.id;
                            minerepairObject.minerepairTime = item.createdAt;
                            minerepairObject.minerepairStatus = item.status;
                            minerepairObject.minerepairTitle = item.title;
                            minerepairObject.minerepairContent = item.content;
                            minerepairItemArray.push(minerepairObject);
                        });
                        minerepairifload = false;
                        if (res.data.length <= 4) {
                            console.log('没有数据了');
                            $('.load-more').text('没有数据了');
                            $('.load-icon').hide();
                            minerepairhasmore = false;
                        }
                    }

                } else {
                    minerepairifload = false;
                    minerepairhasmore = false;
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
                minerepairifload = false;
                minerepairhasmore = false;
                $.showBXAlert('请求出错，请稍候重试！', null);
                console.log('没有数据了');
                $('.load-more').text('没有数据了');
                $('.load-icon').hide();
                console.log(err);
            }
        });

    }


});
