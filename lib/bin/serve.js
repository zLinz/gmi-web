/**
 * Description: Serve a project
 * Author: Liam
 * CreatedAt: 2017-1216-1216
 * UpdateBy:
 * UpdateAt:
 */ 
var webpack = require('webpack'),
    // webpackConfig = require('../util/webpack.config.js'),
    GMILOG = require ('../util/gmi-log'),
    chokidar = require ('chokidar')
    // async = require ('async')

// Generate webpack config object 
var CommonsChunkPlugin = require ("webpack/lib/optimize/CommonsChunkPlugin"),
    path = require ('path'),
    fs = require ('fs'),
    fsExtra = require ('fs-extra'),
    uglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
    srcDir = path.resolve (process.cwd (), 'src'),
    distDir = path.resolve (process.cwd (), 'dist')

// Render Html
var glob = require ('glob'),
    minify = require ('html-minifier').minify

// Generate sass file
var sass = require ('node-sass')

var projectConfig = require (path.resolve (process.cwd (), '') + '/projectVersion.json')

// Express
var express = require ('express')
var app = express ()
var opener = require ('opener')

// RunServer Object
RunServer = module.exports = {}

RunServer.run = function () {
    RunServer.readyUp ()
    RunServer.startServe ()
}

RunServer.readyUp = function () {
    RunServer.webpackTool ()
    RunServer.renderHtml ()
    RunServer.renderSass ()
    RunServer.copyAssets ()
    // RunServer.copyJsLib ()
    RunServer.copyLib ()
    RunServer.watch ()
    // RunServer.copyScssLib ()
}

RunServer.startServe = function () {
    app.use (express.static (distDir))
    app.get('/', function (req, res) {
        // res.send('Hello World')
        res.redirect ('/pages/')
    })
    app.listen (projectConfig.port)
    var browserObject = opener ("http://localhost:" + projectConfig.port)
    // console.log (browserObject)
}

RunServer.renderSass = function () {
    setTimeout ( () => {
        sass.render ({
            file: 'src/scss/pages/main.scss',
            includePaths: ['src/scss/pages/'],
            outFile: 'dist/css',
            sourceMap: true,
            outputStyle: 'compressed',
        }, (error, result) => {
            if (error) {
                GMILOG.E_LOG (error)
            } else {
                fsExtra.outputFile ('dist/css/style.min.css', result.css, err => {
                    if (err) console.log (err)
                })
            }
        })
    }, 500)
}

RunServer.renderHtml = function () {
    // console.log ("run render : " + srcDir + '/**/*.html')
    glob ('src/pages/**/*.html', {}, (err, files) => {
        // console.log (files)
        if (err) {
            console.log (err)
        }
        if (files.length < 1) {
            console.log ("no files")
            // return
        }
        files.forEach (path => {
            fs.readFile (path, 'utf8', (err, content) => {
                if (err) console.log (err)
                renderRecursive (path, content)
            })
        })

    })
}

RunServer.copyAssets = function () {
    fsExtra.copy ('src/assets/', 'dist/assets/', (err) => {
        if (err) console.log (err)
        console.log ("Assets" + " copied!") 
    })
}

RunServer.copyJsLib = function () {
    fsExtra.copy ('src/js/lib', 'dist/js/lib', (err) => {
        if (err) console.log (err)
        console.log ("js lib" + " copied!") 
    })
}

RunServer.copyLib = function () {
    fsExtra.copy ('src/lib', 'dist/lib', (err) => {
        if (err) console.log (err)
        console.log ("lib" + " copied!") 
    })
}

RunServer.copyScssLib = function () {
    fsExtra.copy ('src/scss/lib', 'dist/css/lib', (err) => {
        if (err) console.log (err)
        console.log ("scss lib" + " copied!") 
    })
}

/**
 * add 
 * unlink
 * unlinkDir
 * change
 * 
 */
RunServer.watch = function () {
    chokidar.watch ('src', {
        // ignored: /^src(\\|\/)js(\\|\/)pages.*\.js$/,
        ignoreInitial: true
    }).on ('all', (event, path) => {
        console.log (`event : ${event} ; path : ${path}`)
        if (/^src(\\|\/)js(\\|\/)pages.*\.js$/.test (path)) {
            console.log (path)
            if (event == "add" || event == "unlink") {
                RunServer.webpackTool (event)
            }
        } else if (/^src(\\|\/)pages.*\.html$/.test (path)) {
            console.log(path)
            RunServer.renderHtml ()
        } else if (/^src(\\|\/)scss(\\|\/)pages.*\.scss$/.test (path)) {
            RunServer.renderSass ()
        } else if (/^src(\\|\/)assets*/.test (path)) {
            console.log (path)
            if (event == "add") {
                fsExtra.copy (path, path.replace ('src', 'dist'), (err) => {
                    if (err) console.log (err)
                    console.log (path + " copied!") 
                })
            }
        } else if (/^src(\\|\/)lib.*\.js$/.test (path)) {
            fsExtra.copy (path, path.replace ('src', 'dist'), (err) => {
                if (err) console.log (err)
                console.log (path + " copied!") 
            })
        }
    })
}

RunServer.webpackTool = function (event) {
    if (event == "add" || event == "unlink") {
        if (RunServer.watching) {
            RunServer.watching.close (() => {
                console.log ("restart watch")
            })
        }
        if (RunServer.myDevConfig != null) {
            RunServer.myDevConfig = null
        }
        if (RunServer.devCompiler != null) {
            RunServer.devCompiler = null
        }
        var JsFileName = getJsFile (),
        EntryFileName = getEntryName ()
        //创建一个webpack配置对象
        RunServer.myDevConfig = Object.create ({
            //允许缓存提高性能
            cache: true,
            //生成sourcemap文件
            devtool: "",
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
                    tool: srcDir + "/js/tool",
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
        })
        RunServer.devCompiler = webpack (RunServer.myDevConfig)
        RunServer.watching = RunServer.devCompiler.watch ({ // watch options:
            aggregateTimeout: 300, // wait so long for more changes
            poll: false // use polling instead of native watchers
            // pass a number to set the polling interval
        }, function (err, stats) {
            if (err) GMILOG.E_LOG (err)
            // GMILOG.N_LOG ("-")
            if (!RunServer.statsHash) {
                RunServer.statsHash = stats.hash
                GMILOG.N_LOG (stats.toString ({
                    profile: true, colors: true
                }))
            } else {
                if (RunServer.statsHash != stats.hash) {
                    GMILOG.N_LOG (stats.toString ({
                        profile: true, colors: true
                    }))    
                }
            }
        }) 
    } else {
        var JsFileName = getJsFile (),
        EntryFileName = getEntryName ()
        //创建一个webpack配置对象
        RunServer.myDevConfig = Object.create ({
            //允许缓存提高性能
            cache: true,
            //生成sourcemap文件
            devtool: "",
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
                    tool: srcDir + "/js/tool"
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
        })
        RunServer.devCompiler = webpack (RunServer.myDevConfig)
        RunServer.watching = RunServer.devCompiler.watch ({ // watch options:
            aggregateTimeout: 300, // wait so long for more changes
            poll: false // use polling instead of native watchers
            // pass a number to set the polling interval
        }, function (err, stats) {
            if (err) GMILOG.E_LOG (err)
            // GMILOG.N_LOG ("-")
            if (!RunServer.statsHash) {
                RunServer.statsHash = stats.hash
                GMILOG.N_LOG (stats.toString ({
                    profile: true, colors: true
                }))
            } else {
                if (RunServer.statsHash != stats.hash) {
                    GMILOG.N_LOG (stats.toString ({
                        profile: true, colors: true
                    }))    
                }
            }
        }) 
    }

    // RunServer.devCompiler.run ((err, stats) => {
    //     if (err) GMILOG.E_LOG (err)
    //     // GMILOG.N_LOG ("-")
    //     if (!RunServer.statsHash) {
    //         RunServer.statsHash = stats.hash
    //         GMILOG.N_LOG (stats.toString ({
    //             profile: true, colors: true
    //         }))
    //     } else {
    //         if (RunServer.statsHash != stats.hash) {
    //             GMILOG.N_LOG (stats.toString ({
    //                 profile: true, colors: true
    //             }))    
    //         }
    //     }
    // }) 
}


function renderRecursive (path, content) {
    // console.log (content + "\n-------" + path)
    let regexOuter = /<\%\ \@\@include="(.*?)"\ \%>/
    let regexInclude = /include="(.*?)"/
    let regexInner = />(.*?)</
    let rootReg = /\@PATH\@/
    let versionReg = /\@VERSION\@/
    // let COMMENT_PSEUDO_COMMENT_OR_LT_BANG = new RegExp(
    //     '<!--[\\s\\S]*?(?:-->)?'
    //     + '<!---+>?'  // A comment with no body
    //     + '|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?'
    //     + '|<[?][^>]*>?',  // A pseudo-comment
    //     'g');
    let cleanComment = /\<\!\-\-(\ |)(.*?)\-\-\>/
    while (cleanComment.test (content)) {
        content = content.replace (cleanComment, '')
    }
    // while (COMMENT_PSEUDO_COMMENT_OR_LT_BANG.test (content)) {
    //     content = content.replace (COMMENT_PSEUDO_COMMENT_OR_LT_BANG, '')
    // }
    content = content.replace (regexOuter, match => {
        let matchInclude = match
        let contentUpdated = ''
        // console.log (content)
        // console.log (matchInclude)
        match.replace (regexInclude, match => {
            // console.log (match)
            match.replace (/"(.*?)"/, matchIncludeFile => {
                let includeFileName = matchIncludeFile.substring (1, matchIncludeFile.length - 1)
                // console.log (path)
                let pathRelative = path.split ('/').slice (0, -1).join ('/')
                // console.log (pathRelative)
                if (/^\//.test (includeFileName)) {
                    includeFileName = includeFileName.replace (/^\//, '')
                    pathRelative = "src/pages"
                }
                if (/^includes\//.test (includeFileName)) {
                    includeFileName = includeFileName.replace (/^includes\//, '')
                    pathRelative = "src/pages/includes"
                }
                while (true) {
                    if (/^\.\//.test (includeFileName)) {
                        includeFileName = includeFileName.replace (/^\.\//, '')
                    } else {
                        break
                    }
                }
                while (true) {
                    if (/^\.\.\//.test (includeFileName)) {
                        includeFileName = includeFileName.replace (/^\.\.\//, '')
                        pathRelative = pathRelative.split ('/').slice (0, -1).join ('/')
                    } else {
                        break
                    }
                }
                // console.log (includeFileName)
                // includeFileName.replace (/^\.\//, currentPath => {
                //     console.log (currentPath)
                // })
                // console.log (includeFileName)
                let includeFilePath = pathRelative + "/" + includeFileName
                // contentUpdated = ' ' + matchInclude.replace (regexOuter, '').trim ()
                contentUpdated = matchInclude.replace (regexOuter, match => {
                    let content = ''
                    // console.log (includeFilePath)
                    if (!fs.existsSync (includeFilePath)) {
                        GMILOG.E_LOG (includeFilePath + " File not found!")
                    } else {
                        content = fs.readFileSync (includeFilePath, 'utf8')
                        return '' + content + ''
                    }
                })
            })
        })
        return contentUpdated
    })
    // console.log (content + "\n-------" + path)
    // console.log (/<\%\ \@\@include="(.*?)"\ \%>/.test (content))
    if (/<\%\ \@\@include="(.*?)"\ \%>/.test (content)) {
        renderRecursive (path, content)
    } else {
        let filename = path.replace (/^src/, 'dist').replace (/pages\//, '')

        while (versionReg.test (content)) {
            content = content.replace (versionReg, projectConfig.version)
        }

        while (rootReg.test (content)) {
            content = content.replace (rootReg, projectConfig.root)
        }
        // console.log (filename)
        fsExtra.outputFile (filename, minify (content, {collapseWhitespace: true, removeComments: true}), err => {
            if (err) console.log (err)
        })
    }
}

//获取所有js\pages目录下的文件夹名称
function getDirName () {
    var fileList = []
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
    var fileList = getDirName ()
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
        })
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
    var fileList = getDirName ()
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
                        entryName.push (matchs[1])
                    }
                })
                // }
            }
        })
    }
    return entryName;
    //synchronous read dir,return an array of filenames excluding '.' and '..'
    // console.log("this is detected js: " + dirs);
    //declare matchs array and file object will be used later
    //use reg match any.js file
}
