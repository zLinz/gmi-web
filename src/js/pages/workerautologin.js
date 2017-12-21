 var Host = require('tool/host');
 var Global = require('tool/global');
 var User = require('tool/Userinfo');

 $(function () {
     console.log(location.href);
     // location.href = Global.login.url;
     if (sessionStorage.getItem('worker') == null) {
         $.ajax({
             url: Host.rcmain + Host.interface.worker.getUsernameByOpenid,
             type: 'post',
             data: "openid=" + User.openid,
             success: function (res) {
                 if (res.result) {
                     console.log(res);
                     var worker = new Object();

                     worker.id = res.data.id;
                     worker.type = res.data.type;
                     worker.phone = res.data.phone;
                     worker.openid = res.data.openid;
                     worker.name = res.data.name;

                     var userobject = JSON.stringify(worker);
                     sessionStorage.setItem('worker', userobject);

                     location.href = Global.worker.query;

                 } else {

                     if (location.href.indexOf('worker-login.html') == -1) {
                         location.href = Global.worker.login;
                     }
                 }
             },
             error: function (err) {}
         });
     } else {
         if (location.href.indexOf('worker-login.html') != -1) {
             location.href = Global.worker.query;
         }
     }


 });