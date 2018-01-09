/**
 * @description 项目配置
 */
var _PROJECT_CONFIG = require('../../../projectVersion.js');

window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1) {
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = {
            projectName: _PROJECT_CONFIG.project_name,      //项目名称
            'Message': msg,     // 错误信息
            'URL': url,         // 错误代码页面链接
            'Line': lineNo,     // 错代码行数
            'Agent': window.navigator.userAgent     // 客户端的信息
        };
        alert(message);

    }

    return false;
};
