 var Host = require('tool/host');
 var Global = require('tool/global');
 var User = require('tool/Userinfo');

 $(function () {
     console.log(location.href);
     if (sessionStorage.getItem('curuser') != null) {
         console.log('Aleady have user.');
         if (location.href.indexOf('login/login.html') != -1) {
             location.href = Global.index.url;
         }
     } else {
         // location.href = Global.login.url;
         $.ajax({
             url: Host.rcmain + Host.interface.user.getUsernameByOpenid,
             type: 'post',
             data: "openid=" + User.openid,
             success: function (res) {
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
                     location.reload();
                     //  location.href = Global.index.url;

                 } else {
                     if (location.href.indexOf('app/index.html') == -1) {
                         if (location.href.indexOf('login/register.html') == -1) {
                             if (location.href.indexOf('login/login.html') == -1) {
                                 location.href = Global.login.url;
                                 // console.log('not in register or login page');
                             }
                         }
                     }
                 }
             },
             error: function (err) {}
         });
     }

 });