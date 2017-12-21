var Host = require('tool/host');
var Global = require('tool/global');
var Vue = require('vue/vue.min.js');
var User = require('tool/Userinfo');

$(function() {

    var minelostoffset = 0;
    var minelostlimit = 5;
    var minelostloadtime = 0;
    var minelostifload = false;
    var minelosthasmore = true;
    var mineloststatus = "";
    var minelostorder = "desc";
    sessionStorage.setItem('mineloststatus', "");
    sessionStorage.setItem('minelostorder', "desc");
    var curuser = sessionStorage.getItem('curuser');
    if(curuser == null){
        $.showBXAlert('登录失效，请重新登录！', null);
        location.href = Global.login.url;
    }
    curuser = JSON.parse(curuser);
    //屏幕滚动式的监听事件，实现导航的浮动
    $(window).scroll(function() {
        var bodyScrollTop = document.body.scrollTop;

        if ((!minelosthasmore) || ($(window).scrollTop() > ($('.load-more-box').offset().top + $('.load-more-box').outerHeight())) || (($(window).scrollTop() + $(window).height()) < ($('.load-more-box').offset().top + $('.footer-tabs').outerHeight()))) {
            console.log("不加载minelost");
        } else {
            if (!minelostifload) {
                console.log("加载minelost");
                loadmoreminelost();
            } else {
                console.log("正在加载minelost...");
            }
        }

    });

    loadmoreminelost();

    var minelostItemArray = [];


    $('select[name=mineloststatus]').change(function() {
        if (sessionStorage.getItem('mineloststatus') != $(this).val()) {
            $('.load-more').text('加载中....');
            $('.load-icon').show();
            minelosthasmore = true;
            minelostItemArray.splice(0,minelostItemArray.length);
        }
        sessionStorage.setItem('mineloststatus', $(this).val());
        initminelost();
    });

    $('select[name=minelostorder]').change(function() {
        if (sessionStorage.getItem('minelostorder') != $(this).val()) {
            $('.load-more').text('加载中....');
            $('.load-icon').show();
            minelosthasmore = true;
            minelostItemArray.splice(0,minelostItemArray.length);
        }
        sessionStorage.setItem('minelostorder', $(this).val());
        initminelost();
    });

    function initminelost() {
        minelostoffset = 0;
        minelostlimit = 5;
        minelostloadtime = 0;
        minelosthasmore = true;
        minelostItemArray.length = 0;
        console.log(minelostItemArray);
        loadmoreminelost();
    }

    // 维修页面内容
    var minelostItem = new Vue({
        el: '#mine-lost-card-item',
        data: function() {
            return {
                datas: minelostItemArray
            };
        },
        methods: {
            checkout: function(minelostID) {
                location.href = Global.lost.detail + "#" + minelostID;
            },
            found: function(minelostID) {
                bootbox.confirm({
                    message: "你确定要将失物招领的状态改为已领么？",
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
                    callback: function(result) {
                        console.log('This was logged in the callback: ' + result);
                        console.log('This was logged in the callback: ' + result);
                        var dialog = bootbox.dialog({
                            message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在处理中...</p>',
                            closeButton: false,
                            animate: false
                        });
                        console.log('This was logged in the callback: ' + result);
                        if (result) {
                            $.ajax({
                                url: Host.rcmain + Host.interface.minelost.setStatus(minelostID),
                                type: 'post',
                                data: 'status=已认领' + "&token=" + curuser.token,
                                success: function(res) {
                                    dialog.modal('hide');
                                    if (res.result) {
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
            notfound: function(minelostID) {
                bootbox.confirm({
                    message: "你确定要将失物招领的状态改为未领么？",
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
                    callback: function(result) {
                        console.log('This was logged in the callback: ' + result);
                        var dialog = bootbox.dialog({
                            message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在处理中...</p>',
                            closeButton: false,
                            animate: false
                        });
                        console.log('This was logged in the callback: ' + result);
                        if (result) {
                            $.ajax({
                                url: Host.rcmain + Host.interface.minelost.setStatus(minelostID),
                                type: 'post',
                                data: 'status=待认领' + "&token=" + curuser.token,
                                success: function(res) {
                                    dialog.modal('hide');
                                    if (res.result) {
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
            deleteitem: function(minelostID) {
                bootbox.confirm({
                    message: "你确定要删除此条失物招领么？",
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
                    callback: function(result) {
                        var dialog = bootbox.dialog({
                            message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在处理中...</p>',
                            closeButton: false,
                            animate: false
                        });
                        console.log('This was logged in the callback: ' + result);
                        if (result) {
                            $.ajax({
                                url: Host.rcmain + Host.interface.minelost.deletelost(minelostID),
                                type: 'post',
                                data: 'id=' + minelostID + "&token=" + curuser.token,
                                success: function(res) {
                                    dialog.modal('hide');
                                    if (res.result) {
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


    function loadmoreminelost() {

        minelostoffset = minelostloadtime * minelostlimit;
        minelostifload = true;

        if (sessionStorage.getItem('mineloststatus') != null) {
            mineloststatus = sessionStorage.getItem('mineloststatus');
        }
        if (sessionStorage.getItem('minelostorder') != null) {
            minelostorder = sessionStorage.getItem('minelostorder');
        }

        console.log(mineloststatus);
        console.log(minelostorder);

        var userid = JSON.parse(sessionStorage.getItem('curuser')).id;

        $.ajax({
            url: Host.rcmain + Host.interface.minelost.query,
            type: 'post',
            data: "offset=" + minelostoffset + "&limit=" + minelostlimit + "&status=" + mineloststatus + "&order=" + minelostorder + "&author=" + userid + "&token=" + curuser.token,
            success: function(res) {
                if (res.result) {
                    minelostloadtime++;
                    console.log(res);
                    if (res.data.length <= 0) {
                        minelostifload = false;
                        console.log('no more data!');
                        minelosthasmore = false;
                        $('.load-more').text('没有数据了');
                        $('.load-icon').hide();
                    } else {
                        res.data.forEach(function(item) {
                            let minelostObject = new Object();
                            minelostObject.minelostID = item.id;
                            minelostObject.minelostDate = item.findDate;
                            minelostObject.minelostPhoto = item.photo;
                            minelostObject.minelostStatus = item.status;
                            minelostObject.minelostArea = item.findArea;
                            minelostObject.minelostclaimArea = item.claimArea;
                            minelostObject.minelostDescription = item.description;
                            minelostObject.minelostAuthor = item.author.realname;
                            minelostObject.minelostAuthorImg = item.author.headImg;
                            minelostItemArray.push(minelostObject);
                        });
                        minelostifload = false;
                        if (res.data.length <= 4) {
                            console.log('没有数据了');
                            $('.load-more').text('没有数据了');
                            $('.load-icon').hide();
                            minelosthasmore = false;
                        }
                    }

                } else {
                    minelostifload = false;
                    minelosthasmore = false;
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
                minelostifload = false;
                minelosthasmore = false;
                $.showBXAlert('请求出错，请稍候重试！', null);
                console.log('没有数据了');
                $('.load-more').text('没有数据了');
                $('.load-icon').hide();
                console.log(err);
            }
        });

    }

});