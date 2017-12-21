
var Host = require('tool/host');
var Global = require('tool/global');
var Vue = require('vue/vue.min.js');


$(function() {

    var curuser = sessionStorage.getItem('curuser');
    if(curuser == null){
        $.showBXAlert('登录失效，请重新登录！', null);
        location.href = Global.login.url;
    }
    curuser = JSON.parse(curuser);
    var dialog = bootbox.dialog({
        message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在加载中...</p>',
        closeButton: false,
        animate: false
    });

	var lostId = location.href.split('#')[1];

	if (lostId == null ) {
		$.showBXAlert('维修报告不存在！', null);
		history.go(-1);
	}

	var lostItem = new Vue({
		el: '#lost-detail-card-item',
		data: function() {
            return {
                data: {
					lostID: '',
					lostState: '',
					lostAuthor: '',
					lostTitle: '',
					lostDate: '',
					lostContent: '',
                    claimArea:'',
                    createdAt:''
				}
            };
        },
        methods: {

        }
	});

    $.ajax({
        url: Host.rcmain + Host.interface.lost.getById(lostId),
        type: 'post',
        data: 'token=' + curuser.token,
        success: function(res) {
            if (res.result) {
            	console.log(res);
                lostItem.data.lostID=res.data.id;
                lostItem.data.lostDate=res.data.findDate;
                lostItem.data.lostPhoto=res.data.photo;
                lostItem.data.lostDescription=res.data.description;
                lostItem.data.lostStatus=res.data.status;
                lostItem.data.lostAuthor=res.data.author.realname;
                lostItem.data.lostArea=res.data.findArea;
                lostItem.data.claimArea=res.data.claimArea;
                lostItem.data.lostTitle = res.data.title;
                lostItem.data.lostAuthorImg = res.data.author.headImg;
                lostItem.data.lostAuthorPhone = res.data.author.phone;
                lostItem.data.lostClaimPhone = res.data.claimPhone;
                lostItem.data.createdAt = res.data.createdAt;
            } else {
                $.showBXAlert('错误原因:' + res.reason, null, function () {
                                    if (res.tologin) {
                                        location.href = Global.login.url;
                                    }
                                });
            }
            dialog.modal('hide');
        },
        error: function(err) {
            dialog.modal('hide');
            $.showBXAlert('请求出错，请稍候重试！', null);
            console.log(err);
        }
    });

});
