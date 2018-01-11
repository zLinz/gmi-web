// Export project setting to orther modules
var gmiProject = module.exports = {}

// Project name used in error log
gmiProject.project_name = '模板'
// project port used in local development
gmiProject.port = '9091'
// project version used in version control
gmiProject.version = '0.0.1'
// project root used in local server
gmiProject.root = '/'
// 最紧凑的输出
gmiProject.jsBeautify = true
// 删除所有的注释
gmiProject.jsComments = false
// 在UglifyJs删除没有用到的代码时不输出警告
gmiProject.jsWarnings = false
// 删除所有的 `console` 语句
gmiProject.jsDrop_console = false
// 内嵌定义了但是只用到一次的变量
gmiProject.jsCollapse_vars = false
// 提取出出现多次但是没有定义成变量去引用的静态值
gmiProject.jsReduce_vars = false


// project template mode
gmiProject.normalTemplateUrl = 'http://storage001.gemini-galaxy.com/admin.zip'
gmiProject.adminTemplateUrl = 'http://storage001.gemini-galaxy.com/admin.zip'