/**
 *
 * 主页面加载的js
 *
 */
var Global = require('tool/global');
var Host = require('tool/host');
var gmi_tab = require('tool/footer-tab');
var Vue = require('vue/vue.min.js');
var User = require('tool/Userinfo');

$(function() {
    console.log(User);
    //初始化tab
    var tabs = new gmi_tab({
        index: 0
    });

    // 首页导航栏点击事件
    var $navTabs = $('.nav-tab .gmi-index-tab-item');
    var $navContents = $('.nav-content .gmi-index-tab-content');

    var noticeoffset = 0;
    var noticelimit = 5;
    var noticeloadtime = 0;
    var noticeifload = false;
    var noticehasmore = true;

    var messageoffset = 0;
    var messagelimit = 5;
    var messageloadtime = 0;
    var messageifload = false;
    var messagehasmore = true;
    var messagetype = "";
    var messageorder = "desc";
    sessionStorage.setItem('messagetype', "");
    sessionStorage.setItem('messageorder', "desc");
    var curtabindex = 0;

    //屏幕滚动式的监听事件，实现导航的浮动
    $(window).scroll(function() {
        var bodyScrollTop = document.body.scrollTop;

        if ((!noticehasmore) || ($(window).scrollTop() > ($('.load-more-box').eq(0).offset().top + $('.load-more-box').eq(0).outerHeight())) || (($(window).scrollTop() + $(window).height()) < ($('.load-more-box').eq(0).offset().top + $('.footer-tabs').outerHeight()))) {
            // console.log("不加载notice");
        } else {
            if (!noticeifload) {
                if (curtabindex == 0) {
                    // console.log("加载notice");
                    loadmorenotice();
                }
            } else {
                // console.log("正在加载notice...");
            }
        }

        if ((!messagehasmore) || ($(window).scrollTop() > ($('.load-more-box').eq(1).offset().top + $('.load-more-box').eq(1).outerHeight())) || (($(window).scrollTop() + $(window).height()) < ($('.load-more-box').eq(1).offset().top + $('.footer-tabs').outerHeight()))) {
            // console.log("不加载message");
        } else {
            if (!messageifload) {
                if (curtabindex == 1) {
                    // console.log("加载message");
                    loadmoremessage();
                }
            } else {
                // console.log("正在加载message...");
            }
        }
    });

    loadmorenotice();

    var bulletinItemArray = [];

    var messageItemArray = [];

    // 首页公告内容展示
    var bulletinItem = new Vue({
        el: '#bulletin-card-item',
        data: function() {
            return {
                datas: bulletinItemArray
            };
        },
        methods: {
            checkout: function(bulletinID) {
                location.href = Global.bulletin.detail + "#" + bulletinID;
            }
        }
    });
    // 首页公告留言展示
    var messageItem = new Vue({
        el: '#message-card-item',
        data: function() {
            return {
                datas: messageItemArray
            };
        },
        method: {

        }
    });



    $navContents.eq(1).hide();

    $navTabs.each(function(index) {
        $(this).click(function() {
            curtabindex = index;
            $('.load-more').eq(index).text('加载中...');
            $('.load-icon').eq(index).show();
            if (!noticeifload && index == 0) {
                initnotice();
            } else if (!messageifload && index == 1) {
                initmessage();
            }
            //更改按钮的样式
            $(this).addClass("active").siblings().removeClass("active");
            //显示点击的按钮所对应的内容块，隐藏另外一个按钮所对应的内容块
            $navContents.eq(index).show().siblings().hide();
            //当前元素，即设置点击事件的元素
            console.log($(this))
        });
    });

    function initnotice() {
        noticeoffset = 0;
        noticelimit = 5;
        noticeloadtime = 0;
        noticehasmore = true;
        bulletinItemArray.length = 0;
        console.log(bulletinItemArray);
        loadmorenotice();
    }

    function initmessage() {
        messageoffset = 0;
        messagelimit = 5;
        messageloadtime = 0;
        messagehasmore = true;
        messageItemArray.length = 0;
        console.log(messageItemArray);
        loadmoremessage();
    }

    function loadmorenotice() {
        noticeoffset = noticeloadtime * noticelimit;
        noticeifload = true;
        $.ajax({
            url: Host.rcmain + Host.interface.notice.query,
            type: 'post',
            data: "offset=" + noticeoffset + "&limit=" + noticelimit,
            success: function(res) {
                if (res.result) {
                    noticeloadtime++;
                    console.log(res);
                    if (res.data.length <= 0) {
                        noticeifload = false;
                        console.log('no more data!');
                        noticehasmore = false;
                        $('.load-more').eq(0).text('没有数据了');
                        $('.load-icon').eq(0).hide();
                    } else {
                        res.data.forEach(function(item) {
                            let bulletinObject = new Object();
                            bulletinObject.bulletinID = item.id;
                            bulletinObject.bulletinDate = item.createdAt;
                            bulletinObject.bulletinTitle = item.title;
                            bulletinObject.bulletinContent = item.content;
                            bulletinItemArray.push(bulletinObject);
                        });
                        noticeifload = false;
                        if (res.data.length <= 4) {
                            console.log('没有数据了');
                            $('.load-more').eq(0).text('没有数据了');
                            $('.load-icon').eq(0).hide();
                            noticehasmore = false;
                        } else {
                            $('.load-more').eq(0).text('加载中....');
                            $('.load-icon').eq(0).show();
                            noticehasmore = true;
                        }
                    }

                } else {
                    noticeifload = false;
                    noticehasmore = false;
                    $.showBXAlert('错误原因:' + res.reason, null);
                    console.log('没有数据了');
                    $('.load-more').eq(0).text('没有数据了');
                    $('.load-icon').eq(0).hide();
                }
            },
            error: function(err) {
                noticeifload = false;
                noticehasmore = false;
                $.showBXAlert('请求出错，请稍候重试！', null);
                console.log('没有数据了');
                $('.load-more').eq(0).text('没有数据了');
                $('.load-icon').eq(0).hide();
                console.log(err);
            }
        });
    }

    $('select[name=messagetype]').change(function() {
        console.log(messageItem.$data);
        if( sessionStorage.getItem('messagetype') != $(this).val() ) {
            $('.load-more').eq(1).text('加载中....');
            $('.load-icon').eq(1).show();
            messagehasmore = true;
            messageItemArray.splice(0,messageItemArray.length);
        }
        sessionStorage.setItem('messagetype', $(this).val());
        initmessage();
    });

    $('select[name=messageorder]').change(function() {
        console.log(messageItem.$data);
        if( sessionStorage.getItem('messagetype') != $(this).val() ) {
            $('.load-more').eq(1).text('加载中....');
            $('.load-icon').eq(1).show();
            messagehasmore = true;
            messageItemArray.splice(0,messageItemArray.length);
        }
        sessionStorage.setItem('messageorder', $(this).val());
        initmessage();
    });

    function loadmoremessage() {
        messageoffset = messageloadtime * messagelimit;
        messageifload = true;

        if(sessionStorage.getItem('messagetype') != null) {
            messagetype = sessionStorage.getItem('messagetype');
        }
        if(sessionStorage.getItem('messageorder') != null) {
            messageorder = sessionStorage.getItem('messageorder');
        }

        console.log(messagetype);
        console.log(messageorder);

        $.ajax({
            url: Host.rcmain + Host.interface.message.query,
            type: 'post',
            data: "offset=" + messageoffset + "&limit=" + messagelimit + "&type=" + messagetype + "&order=" + messageorder,
            success: function(res) {
                if (res.result) {
                    messageloadtime++;
                    console.log(res);
                    if (res.data.length <= 0) {
                        messageifload = false;
                        console.log('no more data!');
                        messagehasmore = false;
                        $('.load-more').eq(1).text('没有数据了');
                        $('.load-icon').eq(1).hide();
                    } else {
                        res.data.forEach(function(item) {
                            let messageObject = new Object();
                            messageObject.messageID = item.id;
                            messageObject.messageAuthorName = item.author.realname;
                            messageObject.messageTitle = item.title;
                            messageObject.messageContent = item.content;
                            messageObject.messageDate = item.createdAt;
                            messageObject.messageType = item.type;
                            messageObject.messageStatus = item.status;
                            messageObject.messageAuthorImg = item.author.headImg;
                            if (item.status == "已答复") {
                                messageObject.messageReplyContent = item.reply.content;
                            }
                            messageItemArray.push(messageObject);
                        });
                        messageifload = false;
                        if (res.data.length <= 4) {
                            console.log('有据了');
                            $('.load-more').eq(1).text('没有数据了');
                            $('.load-icon').eq(1).hide();
                            messagehasmore = false;
                        }
                    }

                } else {
                    messageifload = false;
                    messagehasmore = false;
                    $.showBXAlert('错  因:' + res.reason, null);
                    console.log('没有数据了');
                    $('.load-more').eq(1).text('没有数据了');
                    $('.load-icon').eq(1).hide();
                }
            },
            error: function(err) {
                messageifload = false;
                messagehasmore = false;
                $.showBXAlert('请求-错，请稍候重试！', null);
                console.log('没有数据了');
                $('.load-more').eq(1).text('没有数据了');
                $('.load-icon').eq(1).hide();
                console.log(err);
            }
        });
    }

});