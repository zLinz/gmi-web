
var Host = require('tool/host');
var Global = require('tool/global');
var Vue = require('vue/vue.min.js');


$(function() {

    var dialog = bootbox.dialog({
        message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在加载中...</p>',
        closeButton: false,
        animate: false
    });

	var bulletId = location.href.split('#')[1];

	if (bulletId == null ) {
		$.showBXAlert('公告不存在！', null);
		history.go(-1);
	}

	var bulletinItem = new Vue({
		el: '#bulletin-detail-card-item',
		data: function() {
			return {
				data: {
					bulletinID: '',
					bulletinDate: '',
					bulletinTitle: '',
					bulletinContent: '',
					bulletinAuthor: ''
				}
			};
		},
        methods: {

        }
	});


    $.ajax({
        url: Host.rcmain + Host.interface.notice.getById(bulletId),
        type: 'post',
        data: '',
        success: function(res) {
            dialog.modal('hide');
            if (res.result) {
            	console.log(res);
                bulletinItem.data.bulletinID=res.data.id;
                bulletinItem.data.bulletinDate=res.data.createdAt;
                bulletinItem.data.bulletinTitle=res.data.title;
                bulletinItem.data.bulletinContent=res.data.content;
                bulletinItem.data.bulletinAuthor=res.data.author.username;
            } else {
                $.showBXAlert('错误原因:' + res.reason, null);
            }
        },
        error: function(err) {
            dialog.modal('hide');
            $.showBXAlert('请求出错，请稍候重试！', null);
            console.log(err);
        }
    });

});
