var Host = require('tool/host');
var Global = require('tool/global');
var Vue = require('vue/vue.min.js');
var User = require('tool/Userinfo');

$(function () {

    var $releasebtn = $('.release-btn');
    var $backbtn = $('.back-button');
    var $form = $('#form');
    //格式化电话初始化
    $(":input").inputmask();
    var dialog = "";


    var phototname = '';
    var curuser = sessionStorage.getItem('curuser');
    if (curuser == null) {
        $.showBXAlert('登录失效，请重新登录！', null);
        location.href = Global.login.url;
    }
    curuser = JSON.parse(curuser);



    $backbtn.click(function () {

        bootbox.confirm({
            message: "你还未发表失物招领信息，确定退出么？",
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
                    history.go(-1);
                }
            }
        });

    });

    var $photo = $('input[type=file]');

    //上传框初始化
    $("#input-file").fileinput({
        language: 'zh', //设置语言
        uploadUrl: Host.rcmain + Host.interface.file.upload, //上传的地址
        allowedFileExtensions: ["jpg", "jpeg", "png", "gif", "bmp"], //接受的文件后缀
        //uploadExtraData: {"id":1, "fileName":"123.mp3"},
        uploadAsync: true, //默认异步上传
        multiline: true, //语序上传多文件
        showUpload: true, //默认显示上传按钮
        showCancel: false, //是否显示取消按钮,默认是,只在异步上传时显示
        showClose: false, //是否显示关闭按钮,默认是,只在预览框显示情况下可用
        showRemove: true, //显示移除按钮
        showPreview: true, //是都显示预览
        showCaption: false, //是否显示标题
        browserClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false, //是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        maxFileSize: 90112, //单位为kb，如果为0表示不限制文件大小
        maxFileCount: 1, //表示允许同时上传的最大文件个数
        // enctype: 'multipart/form-data',
        validateInitialCount: false,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        // uploadUrl: "http://common.legend-times.com:17202/Oss/UploadFile?bucketName=big-feng&key=a_day", // server upload action
        // uploadAsync: true,
        // maxFileCount: 5,
        // initialPreview: photoArr,
        // initialPreviewAsData: true, // identify if you are sending preview data only and not the raw markup
        // initialPreviewFileType: 'image', // image is the default and can be overridden in config below
        //  overwriteInitial: false
    });

    //按钮上传成功后触发
    $('#input-file').on('filebatchuploadcomplete', function (event, files, extra) {

        console.log(files);

        console.log('upload success!');

    });

    //异步上传返回结果处理
    $("#input-file").on('fileuploaded', function (event, data, previewId, index) {
        //获取图片上传结果
        console.log(data);

        if (data.response.result) {
            phototname = "http://hqgzh.fjny.edu.cn/apach/storage/" + data.response.data;
            dialog.modal('hide');
            dialog = bootbox.dialog({
                message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>发布招领中....</p>',
                closeButton: false,
                animate: false
            });
            var userid = JSON.parse(sessionStorage.getItem('curuser')).id;
            $.ajax({
                url: Host.rcmain + Host.interface.lost.add,
                type: 'post',
                data: decodeURIComponent($form.serialize()) + "&author=" + userid + "&photo=" + phototname + "&token=" + curuser.token,
                success: function (res) {
                    dialog.modal('hide');
                    if (res.result) {
                        $.showBXAlert('发布成功！', null);
                        location.href = Global.lost.url;
                    } else {
                        $.showBXAlert('请求出错，原因：' + res.reason, null, function () {
                            if (res.tologin) {
                                location.href = Global.login.url;
                            }
                        });
                    }
                },
                error: function (err) {
                    dialog.modal('hide');
                    $.showBXAlert('请求出错，请稍后尝试！', null);
                }
            });
        } else {
            dialog.model('hide');
            $.showBXAlert('图片上传失败!', null);
        }


    });

    $releasebtn.click(function () {

        var that = $(this);
        that.attr('disabled', 'disabled');

        var $title = $('input[name=title]').val();
        var $description = $('#input-lost-description').val();
        var $findArea = $('input[name=findArea]').val();
        var $findDate = $('input[name=findDate]').val();
        var $claimArea = $('input[name=claimArea]').val();
        var $claimPhone = $('input[name=claimPhone]').val();

        console.log($('input[name=findDate]'));
        console.log($findDate);

        if (!$title) {
            that.removeAttr('disabled');
            $.showBXAlert('标题不能为空!', null);

        } else if (!$description) {
            that.removeAttr('disabled');
            $.showBXAlert('描述不能为空!', null);
        } else if (!$findArea) {
            that.removeAttr('disabled');
            $.showBXAlert('找到地点不能为空！', null);
        } else if (!$findDate) {
            that.removeAttr('disabled');
            $.showBXAlert('找到日期不能为空！', null);
        } else if (!$claimArea) {
            that.removeAttr('disabled');
            $.showBXAlert('认领地点不能为空！', null);
        } else if (!$claimPhone || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test($claimPhone))) {
            that.removeAttr('disabled');
            $.showBXAlert('手机号不能为空或者格式不正确!', null);
        } else {

            var userid = JSON.parse(sessionStorage.getItem('curuser')).id;

            console.log($('.file-preview-frame')[0] != null);
            if ($('.file-preview-frame')[0] != null) {
                dialog = bootbox.dialog({
                    message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>上传图片中....</p>',
                    closeButton: false,
                    animate: false
                });
                console.log('have photo');
                $('.fileinput-upload-button').click();
            } else {
                dialog = bootbox.dialog({
                    message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>发布招领中....</p>',
                    closeButton: false,
                    animate: false
                });
                console.log('dont have photo');
                $.ajax({
                    url: Host.rcmain + Host.interface.lost.add,
                    type: 'post',
                    data: decodeURIComponent($form.serialize()) + "&author=" + userid + "&photo=" + "&token=" + curuser.token,
                    success: function (res) {
                        that.removeAttr('disabled');
                        dialog.modal('hide');
                        if (res.result) {
                            $.showBXAlert('发布成功！', null);
                            location.href = Global.lost.url;
                        } else {
                            $.showBXAlert('请求出错，原因：' + res.reason, null, function () {
                                if (res.tologin) {
                                    location.href = Global.login.url;
                                }
                            });
                        }
                    },
                    error: function (err) {
                        that.removeAttr('disabled');
                        dialog.modal('hide');
                        $.showBXAlert('请求出错，请稍后尝试！', null);
                    }
                });
            }


            // $.ajax({
            //     url: Host.rcmain + Host.interface.file.upload,
            //     type: 'post',
            //     data: photodata,
            //     contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            //     processData: false, // NEEDED, DON'T OMIT THIS
            //     success: function(res) {
            //         dialog.modal('hide');
            //         if (res.result) {
            //             $.showBXAlert('上传成功！', null);

            //         } else {
            //             $.showBXAlert('请求出错，请稍后尝试！', null);
            //         }
            //     },
            //     error: function(err) {
            //         dialog.modal('hide');
            //         $.showBXAlert('请求出错，请稍后尝试！', null);
            //     }
            // });

            // $.ajax({
            //     url: Host.rcmain + Host.interface.lost.add,
            //     type: 'post',
            //     data: decodeURIComponent($form.serialize()) + "&id=" + userid,
            //     success: function(res) {
            //         dialog.modal('hide');
            //         if (res.result) {
            //             $.showBXAlert('发布成功！', null);
            //             location.href = Global.lost.url;
            //         } else {
            //             $.showBXAlert('请求出错，请稍后尝试！', null);
            //         }
            //     },
            //     error: function(err) {
            //         dialog.modal('hide');
            //         $.showBXAlert('请求出错，请稍后尝试！', null);
            //     }
            // });
        }
    });

});