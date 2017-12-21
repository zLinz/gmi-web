var Global = require('tool/global');
var Host = require('tool/host');
var gmi_tab = require('tool/footer-tab');
var Vue = require('vue/vue.min.js');
var User = require('tool/Userinfo');


$(function() {

    console.log(location.href);

    var curuser = sessionStorage.getItem('curuser');
    // if(curuser == null){
    //     $.showBXAlert('登录失效，请重新登录！', null);
    //     location.href = Global.login.url;
    // }
    curuser = JSON.parse(curuser);

    //初始化tab
    var tabs = new gmi_tab({
        index: 4
    });
    var userid = JSON.parse(sessionStorage.getItem('curuser')).id;
    // 个人页面内容
    var mineItem = new Vue({
        el: '#mine-card-item',
        data: function() {
            return {
                data: {
                    userID: '',
                    userheadimg: '',
                    username: '',
                    userdorm: '',
                    userrepair: '',
                    userlost: '',
                    usermessage: ''
                }
            };
        },
        methods: {
        	logout: function() {
    	       $.ajax({
                    url: Host.rcmain + Host.interface.user.logout,
                    type: 'post',
                    data: "openid=" + User.openid,
                    success: function(res) {
                        if (res.result) {
                            sessionStorage.removeItem('curuser');
                            location.href = Global.login.url;
                        } else {
                            location.reload();
                        }
                    },
                    error: function(err) {
                        $.showBXAlert('请求出错，请稍候重试！', null);
                        console.log(err);
                    }
                });
        	},
            myrepair: function(userID) {
                location.href = Global.mine.repair + "#" + userID;
            },
            mylost: function(userID) {
                location.href = Global.mine.lost + "#" + userID;
            },
            mymessage: function(userID) {
                location.href = Global.mine.message + "#" + userID;
            }
        }
    });

    $.ajax({
        url: Host.rcmain + Host.interface.user.myinfo,
        type: 'post',
        data: "id=" + userid + "&token=" + curuser.token,
        success: function(res) {
            if (res.result) {
                console.log(res);
                mineItem.data.userID = res.data.id;
                mineItem.data.userheadimg = res.data.headImg;
                mineItem.data.userdorm = res.data.dorm;
                mineItem.data.username = res.data.realname;
                mineItem.data.userrepair = res.data.repairCount;
                mineItem.data.usermessage = res.data.messageCount;
                mineItem.data.userlost = res.data.lostCount;
            } else {
                $.showBXAlert('错误原因:' + res.reason, null, function () {
                                    if (res.tologin) {
                                        location.href = Global.login.url;
                                    }
                                });
                console.log('没有数据了');
            }
        },
        error: function(err) {
            $.showBXAlert('请求出错，请稍候重试！', null);
            console.log(err);
        }
    });

});