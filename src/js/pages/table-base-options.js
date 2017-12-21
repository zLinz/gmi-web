// 在实际项目中，可能需要用到多个表格，你使用dom选项把全部的表格设置为相同的布局，
// 这时你可以使用$.fn.dataTable.defaults 对象处理。
$.extend( $.fn.dataTable.defaults, {
    dom: 'l Brtip',
    buttons: [
        {
            extend: 'excel',
            text: '导出excel',
            customizeData: function(obj) {
                console.log(obj);
                var header = obj.header;
                var body = obj.body;
                for(var i in body) {
                    for(var j in header) {
                        if(header[j] == '身份证' || header[j] == '家长电话' || header[j] == '手机号') {
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
    ],
    //开启提示进度条
    processing: true,
    //开启服务器模式
    serverSide: true,
    //保存上次浏览状态
    stateSave: true,
    //水平滚动条
    scrollX: 'auto',
    //是否有分页样式
    paging: true,
    //分页条的样式，全样式，默认simple_numbers
    pagingType: 'full_numbers',
    //是否有每页显示数量选择
    lengthChange: true,
    //是否有搜索框
    searching: false,
    //是否排序
    ordering: true,
    //禁用自动计算列宽
    autoWidth: true,
    //设置第一列是初始排序状态
    order: [[ 0, 'desc' ]],
    language: {
        //当前列的排序状态
        aria: {
            sortAscending: '升序排序',
            sortDescending: '降序排序'
        },
        //分页信息
        paginate: {
            //分页按钮名称
            first: '首页',
            last: '尾页',
            next: '下页',
            previous: '上页'
        },
        //表格数据为空提示
        emptyTable: '表格数据为空',
        //表格有数据的数据
        info: '从第  _START_ 项 到 第 _END_ 项 共  _TOTAL_ 项',
        //表格没有数据的提示
        infoEmpty: '表数据为空',
        //搜索数据来处提示
        infoFiltered: '(从  _MAX_ 项数据中搜索)',
        //在汇总字符串上始终增加的字符串
        infoPostFix: '',
        //小数点表示符号
        sDecimal: '.',
        //千位的分隔符
        sThousands: ',',
        //每页显示多少条数据
        lengthMenu: '每页显示 _MENU_ 项',
        //加载数据时的提示
        loadingRecords: '加载中...',
        //处理进度提示
        processing: '处理中...',
        //搜索标签名称
        search: '搜索:',
        //搜索框的
        searchPlaceholder: '输入搜索信息',
        //
        url: '',
        //搜索数据记录为空的提示
        zeroRecords: '没有匹配的数据'
    }
} );
$.fn.dataTable.ext.errMode = 'throw';

