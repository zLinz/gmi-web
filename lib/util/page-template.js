
gmiPage = module.exports = {}

gmiPage.scssContent = function (pagename) {
    var scssContent = `
.${pagename}-page {
    height: 100%;
    width: 100%;
    .main-body {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
}
            `
            
    return scssContent
}


gmiPage.jsContent = function (pagename) {
    var jsContent = `
/**
 * @description ${pagename} page logic
 * @author Liam
 */
var Global = require('tool/global')
var Host = require('tool/host')

$(function () {
    var app = new Vue({
        el: '.main-body',
        data: {

        },
        mounted: function () {

        },
        methods: {

        }
    })
})
            `
    return jsContent
}


gmiPage.htmlContent = function (pagename) {
    var htmlContent = `
<!DOCTYPE html>
<html>

<head>
    <title>${pagename}</title>
    <% @@include="/includes/header.html" %>
</head>

<body class="${pagename}-page">
    <div class="main-body">

    </div>
    <% @@include="/includes/footer.html" %>
        <script src="@PATH@js/${pagename}.js?version=@VERSION@"></script>
</body>

</html>

    `
    return htmlContent
}