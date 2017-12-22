(function($) {

    var Userinfo = {
        openid: '',
        nickname: '',
        sex: '',
        language: '',
        city: '',
        province: '',
        headimgurl: ''
    }

    if (sessionStorage.getItem('Userinfo') != null) {
        var result = JSON.parse(sessionStorage.getItem('Userinfo'));
    } else if (location.href.split("res=")[1] != null) {
        console.log(decodeURIComponent(location.href.split("res=")[1]));
        var result = JSON.parse(decodeURIComponent(location.href.split("res=")[1]));
    } else {
        // location.href = 'app/login/login.html';
        console.log("Don't have wechat Userinfo.");
    }

    if (result == null && sessionStorage.getItem('Userinfo') == null) {
        console.log('where going to login page.');
         if(location.href.indexOf('login') == -1) {
             location.href = 'app/login/login.html';
         }
    } else {

        console.log("Do have wechat Userinfo.");
        Userinfo.openid = result.openid;
        Userinfo.nickname = result.nickname;
        Userinfo.sex = result.sex;
        Userinfo.language = result.language;
        Userinfo.city = result.city;
        Userinfo.province = result.province;
        Userinfo.headimgurl = result.headimgurl;

        var userobject = JSON.stringify(Userinfo);

        if (sessionStorage.getItem('Userinfo') == null) {
            sessionStorage.setItem('Userinfo', userobject);
        }




    }

    module.exports = Userinfo;

})(window.jQuery);