var Global = require('tool/global');
var Host = require('tool/host');
var gmi_tab = require('tool/footer-tab');
var Vue = require('vue/vue.min.js');
var User = require('tool/Userinfo');

$(function () {
    console.log(location.href);

    var repairoffset = 0;
    var repairlimit = 5;
    var repairloadtime = 0;
    var repairifload = false;
    var repairhasmore = true;
    var repairstatus = "";
    var repairorder = "desc";
    sessionStorage.setItem('repairstatus', "");
    sessionStorage.setItem('repairorder', "desc");

    //初始化tab
    var tabs = new gmi_tab({
        index: 1
    });

    //屏幕滚动式的监听事件，实现导航的浮动
    $(window).scroll(function () {
        var bodyScrollTop = document.body.scrollTop;

        if ((!repairhasmore) || ($(window).scrollTop() > ($('.load-more-box').offset().top + $('.load-more-box').outerHeight())) || (($(window).scrollTop() + $(window).height()) < ($('.load-more-box').offset().top + $('.footer-tabs').outerHeight()))) {
            console.log("不加载repair");
        } else {
            if (!repairifload) {
                console.log("加载repair");
                loadmorerepair();
            } else {
                console.log("正在加载repair...");
            }
        }

    });

    loadmorerepair();

    var repairItemArray = [];
    $('select[name=repairstatus]').change(function () {
        if (sessionStorage.getItem('repairstatus') != $(this).val()) {
            $('.load-more').text('加载中....');
            $('.load-icon').show();
            repairhasmore = true;
            repairItemArray.splice(0, repairItemArray.length);
        }
        sessionStorage.setItem('repairstatus', $(this).val());
        initrepair();
    });

    $('select[name=repairorder]').change(function () {
        if (sessionStorage.getItem('repairorder') != $(this).val()) {
            $('.load-more').text('加载中....');
            $('.load-icon').show();
            repairhasmore = true;
            repairItemArray.splice(0, repairItemArray.length);
        }
        sessionStorage.setItem('repairorder', $(this).val());
        initrepair();
    });



    function initrepair() {
        repairoffset = 0;
        repairlimit = 5;
        repairloadtime = 0;
        repairhasmore = true;
        repairItemArray.length = 0;
        console.log(repairItemArray);
        loadmorerepair();
    }

    // 维修页面内容
    var repairItem = new Vue({
        el: '#repair-card-item',
        data: function () {
            return {
                datas: repairItemArray
            };
        },
        methods: {
            checkout: function (repairID) {
                location.href = Global.repair.detail + "#" + repairID;
            }
        }
    });

    function loadmorerepair() {

        repairoffset = repairloadtime * repairlimit;
        repairifload = true;

        if (sessionStorage.getItem('repairstatus') != null) {
            repairstatus = sessionStorage.getItem('repairstatus');
        }
        if (sessionStorage.getItem('repairorder') != null) {
            repairorder = sessionStorage.getItem('repairorder');
        }

        console.log(repairstatus);
        console.log(repairorder);
        var curuser = sessionStorage.getItem('curuser');
        // if(curuser == null){
        // $.showBXAlert('登录失效，请重新登录！', null);
        // location.reload();
        // }
        curuser = JSON.parse(curuser);
        $.ajax({
            url: Host.rcmain + Host.interface.repair.query,
            type: 'post',
            data: "offset=" + repairoffset + "&limit=" + repairlimit + "&status=" + repairstatus + "&order=" + repairorder + "&token=" + curuser.token,
            success: function (res) {
                if (res.result) {
                    repairloadtime++;
                    console.log(res);
                    if (res.data.length <= 0) {
                        repairifload = false;
                        console.log('no more data!');
                        repairhasmore = false;
                        $('.load-more').text('没有数据了');
                        $('.load-icon').hide();
                    } else {
                        res.data.forEach(function (item) {
                            let repairObject = new Object();
                            repairObject.repairID = item.id;
                            repairObject.repairTime = item.createdAt;
                            repairObject.repairStatus = item.status;
                            repairObject.repairTitle = item.title;
                            repairObject.repairContent = item.content;
                            repairItemArray.push(repairObject);
                        });
                        repairifload = false;
                        if (res.data.length <= 4) {
                            console.log('没有数据了');
                            $('.load-more').text('没有数据了');
                            $('.load-icon').hide();
                            repairhasmore = false;
                        }
                    }

                } else {
                    repairifload = false;
                    repairhasmore = false;
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
                repairifload = false;
                repairhasmore = false;
                $.showBXAlert('请求出错，请稍候重试！', null);
                console.log('没有数据了');
                $('.load-more').text('没有数据了');
                $('.load-icon').hide();
                console.log(err);
            }
        });

    }


});