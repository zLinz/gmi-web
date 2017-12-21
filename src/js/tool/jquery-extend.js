$.fn.extend({
    /**
     * time: 2016-12-29
     * 点击增加信息按钮,替换content-wrapper模块，并为此模块添加回调函数和返回按钮
     * addInfoUrl: 点击添加信息按钮要替换的模块
     * callback: 加载添加信息模块后的回调函数
     *
     * $(".add-info").loadAddInfoForm("*.html #div", function() {console.log("回调函数")});
     */
    'loadAddInfoForm': function (addInfoUrl, callback) {
        this.click(function () {
            //跳转模块
            $('.content-wrapper').load(addInfoUrl, function () {
                //如果有回调函数就执行
                if (callback) {
                    callback();
                }
            });
        });
    },
    /**
     *          * time: 2016-12-29
     * 点击增加信息按钮,替换content-wrapper模块，并为此模块添加回调函数和返回按钮
     * addInfoUrl: 点击添加信息按钮要替换的模块
     * callback: 加载添加信息模块后的回调函数
     *
     * $(".add-info").loadAddInfoForm("*.html #div", function() {console.log("回调函数")});
     */
    'loadModifyInfoForm': function (addInfoUrl, data, callback) {
        //跳转模块
        $('.content-wrapper').load(addInfoUrl, function () {
            //如果有回调函数就执行
            if (callback) {
                var result = null;
                if (data) {
                    if (data.IDcardPhoto && data.IDcardPhoto != 'null') {
                        result = {
                            IDcardPhoto: data.IDcardPhoto,
                            headPhoto: data.headPhoto
                        }
                    } else if (data.photo && data.photo != 'null') {
                        result = data.photo;
                    } else if (data.groupPhoto && data.groupPhoto != 'null') {
                        result = data.groupPhoto;
                    } else if (data.headPhoto && data.headPhoto != 'null') {
                        result = data.headPhoto;
                    }
                }
                callback(result);
            }

        });
    },
    /**
     * time: 2016-12-29
     * 添加信息页面的返回按钮事件，返回列表信息界面
     * backBtnUrl: 添加信息模块的返回按钮
     *
     * $(".back-btn").backBtnClickEvent("*.html", function() {console.log("回调函数")});
     */
    'backBtnClickEvent': function (backBtnUrl, callback) {
        return this.click(function () {
            location.href = backBtnUrl;
            //如果有回调函数就执行
            if (callback) {
                callback();
            }
        });
    },
    /**
     * time: 2017-01-02
     * 添加信息表单按钮的切换
     * obj: 要显示隐藏的表单内容
     *
     * $(".form-tab-btns .btn").formTabsChange(".form-tab");
     */
    'formTabsChange': function (obj) {
        return this.each(function (index) {
            $(this).click(function () {
                obj.eq(index).addClass('show').removeClass('hidden');
                obj.eq(index).siblings().addClass('hidden').removeClass('show');
            });
        });
    },
    /**
     * 移除table 的border-bottom 样式
     * time： 2017-01-06
     *
     * $('#example2').removeTableFooterBorder();
     */
    'removeTableFooterBorder': function () {
        return this.each(function () {
            $(this).removeClass('no-footer');
            $(this).parent('.dataTables_scrollBody').addClass('no-border');
            $('.dataTables_wrapper .dataTables_processing').css('z-index', '1');
            $('.dataTables_wrapper .dataTables_processing').css('height', '60px');
        })
    },
    /**
     * 点击搜索按钮，过滤表格数据
     * @param {Object} table            datatables对象
     * @param {String} searchUrl        带有搜索条件的请求url
     * @param {String} noSearchUrl      没有搜索条件的请求url
     * @param {Boolean} hasDay          日期格式是否有day，如2000-02是没有带day的格式
     */
    'clickSearchBtn': function (table, searchUrl, noSearchUrl, hasDay) {
        return this.click(function () {
            //数据处理中时显示提示框
            var dialog = $.createBXDialog();

            $('body').removeClass('no-padding-right');

            var selectValue = $('#form select[name=searchSelect]').val(); //搜索select的值
            var inputValue = $('#form input[name=searchValue]').val().replace(/\s/g, ''); //搜索input的值
            var searchBegin = $('#form input[name=startTime]').val(); //开始时间
            var searchEnd = $('#form input[name=endTime]').val(); //结束时间
            var searchRecordState = $('#form select[name=searchRecordState]').val(); //审核状态码
            var isSearchLike = $('#form input[name=isSearchLike]').is(':checked'); //是否模糊搜索

            var searchStr = ''; //搜索的拼接URL
            var searchTimeStr = ''; //搜索时间的条件
            var searchStateStr = ''; //搜索状态的条件，收款记录中审核通过的记录
            var isSearchLikeStr = ''; //模糊搜索的条件

            if (searchBegin && !searchEnd || !searchBegin && searchEnd) { //开始时间和结束时间只存在一个
                $.showBXAlert('请指定时间范围!', dialog);
                return;
            } else if (searchBegin && searchEnd) { //开始时间和结束时间都存在
                //后端比较时间创建时间精确到秒，比较年月范围只精确到月
                if (hasDay) {
                    searchTimeStr = `&searchBegin=${searchBegin} 00:00:00&searchEnd=${searchEnd} 23:59:59`;
                } else {
                    searchTimeStr = `&searchBegin=${searchBegin}&searchEnd=${searchEnd}`;
                }
                searchStr += searchTimeStr; //拼接是否有搜索时间的条件
            }

            if (searchRecordState) { //收款记录中审核通过的记录状态记为1，默认不传或传空是搜索所有收款记录
                searchStateStr = '&searchRecordState=' + searchRecordState; //1为搜索审核通过的
                searchStr += searchStateStr; //拼接是否搜索审核通过的收款记录
            }

            if (isSearchLike) { //模糊搜索为true,默认不传或传空是精确搜索
                isSearchLikeStr = '&isSearchLike=' + isSearchLike; //ture为模糊搜索
                searchStr += isSearchLikeStr; //拼接是否模糊搜索的条件
            }
            console.log(searchStr);

            //搜索select选项为空,搜索全部数据或者搜索时间范围内的数据
            if (selectValue == 'null') {
                //重新加载表格数据的url
                var reloadStr = noSearchUrl + '?' + searchStr;

                table.ajax.url(reloadStr).load();
                //隐藏提示框
                dialog.init(function () {
                    dialog.modal('hide');
                });
            } else if (inputValue == '') { //搜索select选项不为空，搜索条件为空的提示
                $.showBXAlert('搜索内容不能为空', dialog);
            } else {
                //搜索select选项不为空，搜索条件存在，搜索指定的数据或者搜索时间范围内指定的数据
                //重新加载表格数据的url
                var reloadStr = searchUrl + '?searchKey=' + selectValue + '&searchValue=' + inputValue + searchStr;

                table.ajax.url(reloadStr).load();
                //隐藏提示框
                dialog.init(function () {
                    dialog.modal('hide');
                });
            }
        });
    },
    /**
     * 搜索input中输入搜索信息结束后，按回车键触发搜索按钮事件
     * @param {Object} $searchBtn 搜索按钮的jQuery对象
     */
    'pressEnterAfterSearchInput': function ($searchBtn) {
        return this.on('keypress', function (e) {
            console.log(e);
            if (e.keyCode == 13) {
                //防止实现的逻辑出现阻塞，导致keypress（会被阻塞）和onsubmit（不影响）异步
                setTimeout(function () {
                    $searchBtn.click();
                }, 0);
                return false; //阻止默认事件
            }
        });
    }
});
$.extend({
    /**
     * 为table添加导出按钮，适用datatable v.1.10以上的版本
     * time: 2016-12-30
     * @param {Object}   table: $("#table").DataTable()生成的对象，不是jq对象
     * @param {Object} #buttons 容纳button的容器
     *
     * var buttons = $.addExportBtnForTable(table);
     */
    'addExportBtnForTable': function (table) {
        return new $.fn.dataTable.Buttons(table, {
            buttons: [{
                    extend: 'excel',
                    text: '导出excel',
                    customizeData: function (obj) {
                        console.log(obj);
                        var header = obj.header;
                        var body = obj.body;
                        for (var i in body) {
                            for (var j in header) {
                                if (header[j] == '身份证' || header[j] == '家长电话' || header[j] == '电话') {
                                    body[i][j] = "'" + body[i][j];
                                }
                            }
                        }
                        console.log(obj.body);
                    }
                },
                {
                    extend: 'csv',
                    text: '导出csv',
                    charset: 'utf-8',
                    bom: true
                },
                {
                    extend: 'copy',
                    text: '复制'
                },
                {
                    extend: 'print',
                    text: '打印'
                }
            ]
        }).container().appendTo($('#buttons'));
    },
    /**
     * 点击发布或回收站按钮时加载新的数据填充表格
     * time: 2017-01-04
     * @param {Number} index        发布或回收按钮的jq对象下标
     * @param {Object} table        要重新加载数据的table
     * @param {String} publishUrl   发布所对应的数据源url
     * @param {String} removeUrl    回收所对应的数据源的url
     *
     * $.reloadTableData(index, table, "/backassets/json/test.json", "/backassets/json/aaa.json");
     */
    'reloadTableData': function (index, table, publishUrl, removeUrl) {
        if (index === 0) {
            table.ajax.url(publishUrl).load();
        } else {
            if (removeUrl) {
                table.ajax.url(removeUrl).load();
            }
        }
    },
    /**
     * 删除表格中的单条数据
     * tiem: 2017-01-06
     * @param {Object} table        要删除数据的表格对象，不是jq对象，datatalbe特有的对象
     * @param {Number} index        当前数据的id
     * @param {String} deleteurl    请求url
     *
     * $.deleteTableData(table, index, Host.v + "taskpoint/delete/");
     */
    'deleteTableData': function (table, deleteurl, sendData) {
        bootbox.confirm('确定删除？', function (result) {
            if (result) {
                //定义对话框
                var dialog = bootbox.dialog({
                    size: 'small',
                    message: '<p><i class="fa fa-spin fa-spinner"></i> 删除中，请稍候...</p>'
                });

                $.ajax({
                    url: deleteurl,
                    type: 'POST',
                    data: sendData,
                    complete: function () {
                        dialog.init(function () {
                            dialog.modal('hide');
                        });
                    },
                    success: function (res) {
                        //删除成功
                        if (res.result) {
                            bootbox.alert({
                                buttons: {
                                    ok: {
                                        label: '确定',
                                        className: 'btn-primary'
                                    }
                                },
                                size: 'small',
                                message: '删除成功！',
                                callback: function () {
                                    //重新加载表格数据
                                    table.ajax.reload();
                                }
                            });
                        } else { //删除失败
                            bootbox.alert({
                                buttons: {
                                    ok: {
                                        label: '确定',
                                        className: 'btn-primary'
                                    }
                                },
                                size: 'small',
                                message: res.desc,
                                callback: function () {}
                            });
                        }
                    },
                    error: function (res) {
                        bootbox.alert({
                            buttons: {
                                ok: {
                                    label: '确定',
                                    className: 'btn-primary'
                                }
                            },
                            size: 'small',
                            message: '请求失败，请稍候再试！',
                            callback: function () {}
                        });
                    }
                })
            }
        });
    },
    /**
     * @description 初始化flatpicker日期选择器插件
     */
    'initFlatpicker': function () {
        $('.flatpicker').flatpickr({
            //设置语言
            locale: 'zh',
            dateFormat: 'Y-m-d',
            disableMobile: true,
            onMonthChange: function () {
                //                  console.log(this._selectedDateObj.toLocaleDateString());
            }
        });
    },
    /**
     * @description 初始化flatpicker日期选择器插件，没有到天
     */
    'initFlatpickerNotDay': function () {
        $('.flatpicker').flatpickr({
            //设置语言
            locale: 'zh',
            dateFormat: 'Y-m',
            disableMobile: true,
            onMonthChange: function () {
                //                  console.log(this._selectedDateObj.toLocaleDateString());
            }
        });
    },
    /**
     * @description 显示提示框，如果有dialog，则执行dialog的方法隐藏其自身
     * @param(String) msg 要显示的字符串
     * @param(Object) dialog 要隐藏的dialog对象
     */
    'showBXAlert': function (msg, dialog, done) {
        var str = msg || '这是一个提示框!';
        bootbox.alert({
            buttons: {
                ok: {
                    label: '确定',
                    className: 'btn-primary'
                }
            },
            size: 'small',
            message: str,
            callback: function () {
                if (dialog) {
                    dialog.init(function () {
                        dialog.modal('hide');
                    });
                }
                if (done) {
                    done();
                }
            }
        });
    },
    /**
     * @description 创建一个bootbox.dialog对象，显示数据处理中
     */
    'createBXDialog': function () {
        return bootbox.dialog({
            size: 'small',
            message: '<p><i class="fa fa-spin fa-spinner"></i> 数据处理中，请稍候...</p>'
        });
    },
    /**
     * @description ajax请求
     * @param {String} url  请求url
     * @param {Object} sendData  请求的data
     * @param {String} successMsg  请求成功的提示信息
     * @param {Object} dialog  是否需要对bootbox.dialog对象进行隐藏
     * @param {Boolean} hasBackBtn  是否有返回按钮的点击
     */
    'ajaxRequestTemplate': function (url, sendData, successMsg, dialog, hasBackBtn) {

        $.ajax({
            url: url, //请求url
            type: 'POST', //请求类型
            data: sendData, //发送到服务器的数据
            complete: function () { //请求完成，不论失败的方法
                if (dialog) { //请求前有dialog提示框，这里对其隐藏
                    dialog.init(function () {
                        dialog.modal('hide');
                    });
                }
            },
            success: function (res) { //请求成功
                console.log(res);
                if (res.result) {
                    bootbox.alert({
                        buttons: {
                            ok: {
                                label: '确定',
                                className: 'btn-primary'
                            }
                        },
                        size: 'small',
                        message: successMsg,
                        callback: function () {
                            if (hasBackBtn) { //如果该请求页面有返回按钮
                                $('.back-btn').click();
                            }
                        }
                    });
                } else {
                    bootbox.alert({
                        buttons: {
                            ok: {
                                label: '确定',
                                className: 'btn-primary'
                            }
                        },
                        size: 'small',
                        message: res.desc,
                        callback: function () {}
                    });
                }
            },
            error: function (res) {
                bootbox.alert({
                    buttons: {
                        ok: {
                            label: '确定',
                            className: 'btn-primary'
                        }
                    },
                    size: 'small',
                    message: '请求失败，请稍候再试！',
                    callback: function () {}
                });
            }
        });
    },
    /**
     * @description 获取详细的详细用于修改
     * @param {String} url  请求数据的url
     * @param {Object} sendData  请求数据的url
     * @param {Boolean} hasBackBtn  获取数据失败，是否点击返回按钮
     * @param {Object} dialog  请求数据前是否有dialog
     */
    'getDetailInfoForModify': function (url, sendData, hasBackBtn, dialog) {
        //deferred对象的含义就是"延迟"到未来某个点再执行。
        var defer = $.Deferred();
        $.ajax({
            url: url,
            type: 'POST',
            data: sendData,
            success: function (res) {
                if (res.result) {
                    defer.resolve(res);
                } else {
                    bootbox.alert({
                        buttons: {
                            ok: {
                                label: '确定',
                                className: 'btn-primary'
                            }
                        },
                        size: 'small',
                        message: res.desc,
                        callback: function () {
                            if (hasBackBtn) { //请求失败点击返回按钮
                                $(".back-btn").click();
                            } else if (dialog) { //请求失败，不点击返回按钮，隐藏dialog
                                dialog.init(function () {
                                    dialog.modal('hide');
                                });
                            }
                        }
                    });
                }
            },
            error: function (err) {
                bootbox.alert({
                    buttons: {
                        ok: {
                            label: '确定',
                            className: 'btn-primary'
                        }
                    },
                    size: 'small',
                    message: '请求失败，请稍候再试！',
                    callback: function () {
                        if (hasBackBtn) { //请求失败点击返回按钮
                            $(".back-btn").click();
                        } else if (dialog) { //请求失败，不点击返回按钮，隐藏dialog
                            dialog.init(function () {
                                dialog.modal('hide');
                            });
                        }
                    }
                });
            }
        });
        return defer.promise();
    }

});