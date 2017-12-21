/*! functions.js */

/**
 * 注册页面加载js
 *
 */
var Host = require('tool/host');
var Global = require('tool/global');
var User = require('tool/Userinfo');


$(function () {
	var $backlogin = $('.back-login');
	var $register = $('.register-btn');

	var $form = $('#form');

	//格式化电话初始化
	$(":input").inputmask();
	$backlogin.click(function () {
		bootbox.confirm({
			message: "你还未提交注册信息，你确定要退回到登录页面么？",
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
			callback: function (result) {
				console.log('This was logged in the callback: ' + result);
				if (result) {
					location.href = Global.login.url;
				}
			}
		});
	});

	$register.click(function () {

		var that = $(this);
		//点击登陆按钮后禁用，防止重复提交数据
		that.attr('disabled', 'disabled');

		//用户名
		var realname = $('input[name=realname]').val();
		//登陆学号
		var username = $('input[name=username]').val();
		//登陆密码
		var password = $('input[type=password]').val();
		var dorm = $('input[name=dorm]').val();
		var grade = $('input[name=grade]').val();
		var phone = $('input[name=phone]').val();


		console.log(username);

		//用户名密码不能为空，否则弹出提示框
		if (!username) {
			that.removeAttr('disabled');
			$.showBXAlert('学号/工号不能为空！', null);
		} else if (!realname) {
			that.removeAttr('disabled');
			$.showBXAlert('姓名不能为空！', null);
		} else if (!password) {
			that.removeAttr('disabled');
			$.showBXAlert('密码不能为空！', null);
		} else if (password.length <= 5) {
			that.removeAttr('disabled');
			$.showBXAlert('密码长度不能小于6位！', null);
		} else if (!dorm) {
			that.removeAttr('disabled');
			$.showBXAlert('宿舍不能为空', null);
		} else if (!phone || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone))) {
			that.removeAttr('disabled');
			$.showBXAlert('手机号不能为空或者格式不正确!', null);
		} else {
			console.log(decodeURIComponent($form.serialize()));
			var dialog = bootbox.dialog({
				message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在加载中...</p>',
				closeButton: false,
				animate: false
			});
			$.ajax({
				url: Host.rcmain + Host.interface.user.register,
				type: 'post',
				data: decodeURIComponent($form.serialize()) + "&password=" + $.md5(Host.salt + password) + "&openid=" + User.openid + "&headImg=" + User.headimgurl,
				success: function (res) {
					that.removeAttr('disabled');
					dialog.modal('hide');
					if (res.result) {
						location.href = Global.login.url;
					} else {
						$.showBXAlert('错误原因:' + res.reason, null);
					}
				},
				error: function (err) {
					that.removeAttr('disabled');
					$.showBXAlert('请求出错，请稍候重试！', null);
					console.log(err);
				}
			});
		}
	});

});