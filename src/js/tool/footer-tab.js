// 创建一个tab对象
var gmi_tab = function(options) {

    this.$footerItems = null;
    //初始化
    this.init(options);
};



var proto = gmi_tab.prototype;

proto.init = function(options) {

    var menu_show = false;

    $('#gmi-menu-modal').on('show.bs.modal', function(e) {
        menu_show = true;

    });
    $('#gmi-menu-modal').on('hide.bs.modal', function(e) {
        menu_show = false;
    });

    // 弹出菜单中的四个按钮对象
    $('.gmi-menu-item').each(function(index, element) {
        $(this).click(function() {
            switch (index) {
                case 0:
                    if (sessionStorage.getItem('curuser') != null) {
                        location.href = 'app/release/release-repair.html';
                    } else {
                        location.href = 'app/login/login.html';
                    }
                    // location.href = "/app/activity/activity-page.html";
                    break;
                case 1:
                    if (sessionStorage.getItem('curuser') != null) {
                        location.href = 'app/release/release-lost.html';
                    } else {
                        location.href = 'app/login/login.html';
                    }
                    // $('#gmi-menu-modal').modal('hide');
                    // bootbox.confirm(location.href, function(result){
                    //     console.log('This was logged in the callback: ' + result);
                    // });
                    // toastbox.info("功能敬请期待!");
                    break;
                case 2:
                    if (sessionStorage.getItem('curuser') != null) {
                        location.href = 'app/release/release-message.html';
                    } else {
                        location.href = 'app/login/login.html';
                    }
                    //  $('#gmi-menu-modal').modal('hide');
                    // var dialog = bootbox.dialog({
                    //     message: '<p class="text-center"><i class="fa fa-spinner fa-spin"></i>正在加载中...</p>',
                    //     closeButton: false
                    // });
                    // setTimeout( () => {
                    //     dialog.modal('hide');
                    // }, 2000);
                    // if(User.ishider){
                    //     toastbox.info("你已经是隐形人啦!");
                    // }else{
                    //     location.href = "/app/hollowman/hollowman.html";
                    // }
                    break;
                    // case 3:
                    //     bootbox.alert(location.href);
                    //     // if(User.ishider){
                    //     //     location.href = "/app/upload/upload.html";
                    //     // }else{
                    //     //     toastbox.info("使用这个功能请先成为隐形人!");
                    //     // }
                    //     break;
                    // case 4:
                    //     bootbox.alert(location.href);
                    //     // if(User.ishider){
                    //     //     location.href = "/app/apply/applyhollow.html";
                    //     // }else{
                    //     //     toastbox.info("使用这个功能请先成为隐形人!");
                    //     // }
                    //     break;
                    // case 5:
                    //     bootbox.alert(location.href);
                    //     // if(User.ishider){
                    //     //     location.href = "/app/hollownotify/hollownotify.html";
                    //     // }else{
                    //     //     toastbox.info("使用这个功能请先成为隐形人!");
                    //     // }
                    // break;
                default:
                    // location.href = "app/activity/activity-page.html";
                    break;
            }
        });
    });

    this.$footerItems = $(".footer-tabs .tabs-item");
    if (this.$footerItems !== null) {
        this.$footerItems.eq(options.index).addClass("active").find("span");

        //监听每个页面的tab点击事件进行跳转
        this.$footerItems.each(function(index, element) {
            $(this).click(function() {
                switch (index) {
                    case 0:
                        location.href = "app/index.html";
                        break;
                    case 1:
                        if (sessionStorage.getItem('curuser') != null) {
                            location.href = "app/repair/repair.html";
                        } else {
                            location.href = 'app/login/login.html';
                        }
                        break;
                    case 2:
                        // $(this).tooltip('show');
                        // 点击中间菜单按钮时，禁止滑动
                        document.addEventListener('touchmove', function(event) {　　 //监听滚动事件
                            if (menu_show) {
                                event.preventDefault();　　　　　　　　
                            } else {
                                return true;
                            }
                        }, {
                            passive: false
                        });
                        break;
                    case 3:
                        if (sessionStorage.getItem('curuser') != null) {
                            location.href = "app/lost/lost.html";
                        } else {
                            location.href = 'app/login/login.html';
                        }
                        break;
                    case 4:
                        if (sessionStorage.getItem('curuser') != null) {
                            location.href = "app/mine/mine.html";
                        } else {
                            location.href = 'app/login/login.html';
                        }
                        break;
                    default:
                        break;
                }
            });
        });
    }
};

module.exports = gmi_tab;