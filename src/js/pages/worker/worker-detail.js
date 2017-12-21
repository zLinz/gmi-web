
var Host = require('tool/host');
var Global = require('tool/global');
var Vue = require('vue/vue.min.js');


$(function() {
    var worker = sessionStorage.getItem('worker');
    if(worker == null){
        $.showBXAlert('登录失效，请重新登录！', null);
        location.href = Global.login.url;
    }
    worker = JSON.parse(worker);
    var dialog = bootbox.dialog({
        message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在加载中...</p>',
        closeButton: false,
        animate: false
    });

	var repairId = location.href.split('#')[1];

	if (repairId == null ) {
		$.showBXAlert('维修报告不存在！', null);
		history.go(-1);
	}

	var repairItem = new Vue({
		el: '#repair-detail-card-item',
		data: function() {
            return {
                data: {
					repairID: '',
					repairStatus: '',
					repairAuthor: '',
					repairTitle: '',
					repairDate: '',
					repairContent: '',
                    repairAddress:''
				}
            };
        },
        methods: {

        }
	});


    $.ajax({
        url: Host.rcmain + Host.interface.repair.getById(repairId),
        type: 'post',
        data: '',
        success: function(res) {
            if (res.result) {
            	console.log(res);
                repairItem.data.repairID=res.data.id;
                repairItem.data.repairDate=res.data.createdAt;
                repairItem.data.repairFinishDate=res.data.updatedAt;
                repairItem.data.repairTitle=res.data.title;
                repairItem.data.repairContent=res.data.content;
                repairItem.data.repairAddress=res.data.address;
                repairItem.data.repairStatus=res.data.status;
                if(res.data.status == "报修中") {
                    $(".repair-state-1").addClass('active');
                } else if(res.data.status == "已派单") {
                    $(".repair-state-2").addClass('active');
                } else if(res.data.status == "维修中") {
                    $(".repair-state-3").addClass('active');
                } else if(res.data.status == "已维修") {
                    $(".repair-state-4").addClass('active');
                }
                repairItem.data.repairAuthor=res.data.author.realname;
                repairItem.data.repairAuthorPhone=res.data.author.phone;
                if(res.data.workerPhone != null) {
                    repairItem.data.repairWorkerPhone = res.data.workerPhone;
                    repairItem.data.repairWorkerName = res.data.workerName;
                    repairItem.data.repairWorkerDate = res.data.assign.receiveTime;
                    repairItem.data.repairWorkerType = res.data.workerType;
                }
                if(res.data.adminPhone != null) {
                    repairItem.data.repairAdminPhone = res.data.adminPhone;
                    if(res.data.adminName == 'admin') {
                        res.data.adminName = "管理员";
                    }
                    repairItem.data.repairAdminDate = res.data.assign.updatedAt;
                    repairItem.data.repairAdminName = res.data.adminName;
                }
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
