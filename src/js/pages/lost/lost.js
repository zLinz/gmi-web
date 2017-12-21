var Global = require('tool/global');
var Host = require('tool/host');
var gmi_tab = require('tool/footer-tab');
var Vue = require('vue/vue.min.js');

$(function () {
    console.log(location.href);

    var lostoffset = 0;
    var lostlimit = 5;
    var lostloadtime = 0;
    var lostifload = false;
    var losthasmore = true;
    var loststatus = "";
    var lostorder = "desc";
    sessionStorage.setItem('loststatus', "");
    sessionStorage.setItem('lostorder', "desc");

    //屏幕滚动式的监听事件，实现导航的浮动
    $(window).scroll(function () {
        var bodyScrollTop = document.body.scrollTop;

        if ((!losthasmore) || ($(window).scrollTop() > ($('.load-more-box').offset().top + $('.load-more-box').outerHeight())) || (($(window).scrollTop() + $(window).height()) < ($('.load-more-box').offset().top + $('.footer-tabs').outerHeight()))) {
            console.log("不加载lost");
        } else {
            if (!lostifload) {
                console.log("加载lost");
                loadmorelost();
            } else {
                console.log("正在加载lost...");
            }
        }

    });

    loadmorelost();

    //初始化tab
    var tabs = new gmi_tab({
        index: 3
    });

    var lostItemArray = [];

    $('select[name=loststatus]').change(function () {
        if (sessionStorage.getItem('loststatus') != $(this).val()) {
            $('.load-more').text('加载中....');
            $('.load-icon').show();
            losthasmore = true;
            lostItemArray.splice(0, lostItemArray.length);
        }
        sessionStorage.setItem('loststatus', $(this).val());
        initlost();
    });

    $('select[name=lostorder]').change(function () {
        if (sessionStorage.getItem('lostorder') != $(this).val()) {
            $('.load-more').text('加载中....');
            $('.load-icon').show();
            losthasmore = true;
            lostItemArray.splice(0, lostItemArray.length);
        }
        sessionStorage.setItem('lostorder', $(this).val());
        initlost();
    });



    function initlost() {
        lostoffset = 0;
        lostlimit = 5;
        lostloadtime = 0;
        losthasmore = true;
        lostItemArray.length = 0;
        console.log(lostItemArray);
        loadmorelost();
    }

    // 维修页面内容
    var lostItem = new Vue({
        el: '#lost-card-item',
        data: function () {
            return {
                datas: lostItemArray
            };
        },
        methods: {
            checkout: function (lostID) {
                location.href = Global.lost.detail + "#" + lostID;
            }
        }
    });

    function loadmorelost() {

        lostoffset = lostloadtime * lostlimit;
        lostifload = true;

        if (sessionStorage.getItem('loststatus') != null) {
            loststatus = sessionStorage.getItem('loststatus');
        }
        if (sessionStorage.getItem('lostorder') != null) {
            lostorder = sessionStorage.getItem('lostorder');
        }

        console.log(loststatus);
        console.log(lostorder);
        var curuser = sessionStorage.getItem('curuser');
        // if(curuser == null){
        //     $.showBXAlert('登录失效，请重新登录！', null);
        //     location.href = Global.login.url;
        // }
        curuser = JSON.parse(curuser);
        $.ajax({
            url: Host.rcmain + Host.interface.lost.query,
            type: 'post',
            data: "offset=" + lostoffset + "&limit=" + lostlimit + "&status=" + loststatus + "&order=" + lostorder + "&token=" + curuser.token,
            success: function (res) {
                if (res.result) {
                    lostloadtime++;
                    console.log(res);
                    if (res.data.length <= 0) {
                        lostifload = false;
                        console.log('no more data!');
                        losthasmore = false;
                        $('.load-more').text('没有数据了');
                        $('.load-icon').hide();
                    } else {
                        res.data.forEach(function (item) {
                            let lostObject = new Object();
                            lostObject.lostID = item.id;
                            lostObject.lostDate = item.findDate;
                            lostObject.lostPhoto = item.photo;
                            lostObject.lostStatus = item.status;
                            lostObject.lostArea = item.findArea;
                            lostObject.lostclaimArea = item.claimArea;
                            lostObject.lostDescription = item.description;
                            lostObject.lostAuthor = item.author.realname;
                            lostObject.lostAuthorImg = item.author.headImg;
                            lostObject.lostAuthorPhone = item.author.phone;
                            lostObject.lostClaimPhone = item.claimPhone;
                            lostItemArray.push(lostObject);
                        });
                        lostifload = false;
                        if (res.data.length <= 4) {
                            console.log('没有数据了');
                            $('.load-more').text('没有数据了');
                            $('.load-icon').hide();
                            losthasmore = false;
                        }
                    }

                } else {
                    lostifload = false;
                    losthasmore = false;
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
            error: function (err) {
                lostifload = false;
                losthasmore = false;
                $.showBXAlert('请求出错，请稍候重试！', null);
                console.log('没有数据了');
                $('.load-more').text('没有数据了');
                $('.load-icon').hide();
                console.log(err);
            }
        });

    }

});