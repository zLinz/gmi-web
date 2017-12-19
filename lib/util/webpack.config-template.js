/**
 webpack for gmi-web
 created by Liam
 version 1.1.3
*/

var GMILOG = require ('./gmi-log')
// CommonsChunkPlugin用于生成公用代码，不只可以生成一个，还能根据不同页面的文件关系，自由生成多个
var CommonsChunkPlugin = require ("webpack/lib/optimize/CommonsChunkPlugin")
// 引用nodejs的path模块来解析路径
var path = require ('path')
//引用nodejs的webpack模块
var webpack = require ('webpack')
//引用nodejs的文件系统
var fs = require ('fs')
//引用webpack中的插件用来压缩javascript代码
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin


//  DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic, see https://github.com/webpack/loader-utils/issues/56
// parseQuery() will be replaced with getOptions() in the next major version of loader-utils.
// process.traceDeprecation = true

//process 是nodejs全局对象，不需要require就能够引用
//process.cwd()返回绝对路径，path.resolve解析当前路径：绝对路径 + "/src"
var srcDir = path.resolve (process.cwd (), 'src');
var distDir = path.resolve (process.cwd (), 'dist');
//获取多页面的每个入口文件，用于配置中的entry
// function getEntry(){
//     var jsPath = path.resolve(srcDir,'js');
//     //synchronous read dir,return an array of filenames excluding '.' and '..'
//     var dirs = fs.readdirSync(jsPath);
//     //declare matchs array and file object will be used later
//     var matchs = [],files = {};
//     dirs.forEach(function (item){
//         //use reg match any.js file
//         matchs = item.match(/(.+)\.js$/);
//         if (matchs){
//             files[matchs[1]] = path.resolve(srcDir,'js',item);
//         }
//     });
//     return files;
// }

var DirName = getDirName ()
var JsFileName = getJsFile ()
var EntryFileName = getEntryName ()
//获取所有js\pages目录下的文件夹名称
function getDirName () {
    var fileList = [];
    var jsPath = path.resolve (srcDir, 'js/pages')
    // GMILOG.N_LOG (jsPath);
    if (!fs.existsSync (jsPath)) {
        GMILOG.E_LOG (jsPath + " is not exist!")
    } else {
        var dirs = fs.readdirSync (jsPath)
        dirs.forEach (function (item) {
            fileList.push (item)
        })
    }
    // GMILOG.N_LOG (fileList);
    return fileList
}

//遍历获取js文件的数组
function getJsFile () {
    //获取js目录下所有文件夹名字数组
    var fileList = DirName
    var totalFiles = {}
    var matchs = [],
        files = {}
    if (fileList.length > 0) {
        fileList.forEach (function (fileItem) {
            if (fileItem.match (/(.+)\.js$/)) {
                matchs = fileItem.match (/(.+)\.js$/)
                if (matchs) {
                    files[matchs[1]] = path.resolve (srcDir, 'js/pages', fileItem)
                }
            } else {
                var jsPath = path.resolve (srcDir, 'js/pages/' + fileItem)
                // if (!fs.existsSync (jsPath)) {
                //     GMILOG.E_LOG (jsPath + " is not exist!")
                // } else {
                var dirs = fs.readdirSync (jsPath)
                dirs.forEach (function (item) {
                    matchs = item.match (/(.+)\.js$/)
                    if (matchs) {
                        files[matchs[1]] = path.resolve (srcDir, 'js/pages/' + fileItem, item)
                    }
                });
                // }
            }
        });
    }
    return files
    //synchronous read dir,return an array of filenames excluding '.' and '..'
    // console.log("this is detected js: " + dirs);
    //declare matchs array and file object will be used later
    //use reg match any.js file
}

//遍历获取js文件的数组
function getEntryName () {
    //获取js目录下所有文件夹名字数组
    var fileList = DirName
    var totalFiles = {}
    var entryName = []
    var matchs = [],
        files = {}
    if (fileList.length > 0) {
        fileList.forEach (function (fileItem) {
            if (fileItem.match (/(.+)\.js$/)) {
                matchs = fileItem.match (/(.+)\.js$/)
                if (matchs) {
                    entryName.push (matchs[1]);
                }
            } else {
                var jsPath = path.resolve (srcDir, 'js/pages/' + fileItem)
                // if (!fs.existsSync (jsPath)) {
                //     GMILOG.E_LOG (jsPath + " is not exist!")
                // } else {
                var dirs = fs.readdirSync (jsPath)
                dirs.forEach (function (item) {
                    matchs = item.match (/(.+)\.js$/)
                    if (matchs) {
                        entryName.push (matchs[1]);
                    }
                });
                // }
            }
        });
    }
    return entryName;
    //synchronous read dir,return an array of filenames excluding '.' and '..'
    // console.log("this is detected js: " + dirs);
    //declare matchs array and file object will be used later
    //use reg match any.js file
}

GMILOG.N_LOG (DirName)
GMILOG.N_LOG (JsFileName)
GMILOG.N_LOG (EntryFileName)

module.exports = {
    //允许缓存提高性能
    cache: true,
    //生成sourcemap文件
    devtool: "source-map",
    //多文件入口
    entry: JsFileName,
    output: {
        //__diename返回当前文件所在的路劲
        path: path.resolve (distDir, 'js/'),
        //The publicPath specifies the public URL address of the output files when referenced in a browser.
        // the url to the output directory resolved relative to the HTML page，网站运行时访问的路径
        publicPath: path.resolve (distDir, 'js/'),
        //生成文件的命名
        filename: "[name].js",
        //是未被列在entry中，却又需要被打包出来的文件命名配置,在按需加载（异步）模块的时候，这样的文件是没有被列在entry中的，如使用CommonJS的方式异步加载模块
        /*
        require.ensure(["modules/tips.jsx"], function(require) {
             var a = require("modules/tips.jsx");
             // ...
         }, 'tips');
         异步加载的模块是要以文件形式加载哦，所以这时生成的文件名是以chunkname配置的，生成出的文件名就是tips.min.js。
         */
        chunkFilename: "[chunkhash].js"
    },
    resolve: {
        //查找module的话从这里开始查找
        //root: '/pomy/github/flux-example/src', //绝对路径
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        //extensions: ['', '.js', '.json', '.scss'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            // zepto: srcDir + "/js/lib/zepto.min.js",
            core: srcDir + "/js/core",
            util: srcDir + "/js/util",
            bootstrap: srcDir + "/js/lib/bootstrap",
            swiper: srcDir + "/js/lib/swiper",
            adminlte: srcDir + "/js/lib/adminlte",
            jquery: srcDir + "/js/lib/jquery",
            tool: srcDir + "/js/tool",
            vue: srcDir + "/js/lib/vue",
        }
    },
    module: {
        //加载器配置
        //解析出zepto的路径，然后使用加载器进行zepto的改变
        rules: [{
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }],
            },

            // Loaders for other file types can go here
        ],
    },
    plugins: [
            new CommonsChunkPlugin ({name: 'common', chunks: EntryFileName}),
            new uglifyJsPlugin ({
                // 最紧凑的输出
                beautify: true,
                // 删除所有的注释
                comments: false,
                compress: {
                    // 在UglifyJs删除没有用到的代码时不输出警告
                    warnings: false,
                    // 删除所有的 `console` 语句
                    // 还可以兼容ie浏览器
                    drop_console: false,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: false,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: false,
                }
            })
        ]
        //当我们想在项目中require一些其他的类库或者API，而又不想让这些类库的源码被构建到运行时文件中，这在实际开发中很有必要。此时我们就可以通过配置externals参数来解决这个问题
        // externals: {
        //     "jquery": "jQuery"
        // }
};