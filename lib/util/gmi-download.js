/**
 * Description: Download Handle Util
 * Author: Liam
 * CreatedAt: 2017-1107-1222
 * UpdateBy:
 * UpdateAt:
 */

var path = require('path'),
    GMILOG = require('./gmi-log'),
    fs = require('fs'),
    request = require('request'),
    fsExtra = require('fs-extra'),
    logUpdate = require('log-update'),
    decompress = require('decompress'),
    decompressUnzip = require('decompress-unzip')


var frames = ['-', '\\', '|', '/'];
var frames_i = 0;

var download = module.exports = {}


download.request = function (name, dir, type) {
    console.log(type);
    request.get("http://storage001.gemini-galaxy.com/template.json").on('response', (response) => {
        if (response.statusCode == 200) {
            var len = parseInt(response.headers['content-length'], 10);
            // console.log(len)
            var cur = 0;
            var total = len / 1048576; //1048576 - bytes in  1Megabyte
            if (len <= 0) {
                GMILOG.E_LOG('Download data error.')
            } else {
                var fileObject = fs.createWriteStream(dir + '/template.json');
                response.on('data', (data) => {
                    cur += data.length
                    var frame = frames[frames_i = ++frames_i % frames.length];
                    logUpdate(frame + " Downloading " + (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb " + " Total size: " + total.toFixed(2) + " mb");
                    fileObject.write(data)
                }).on('end', (data) => {
                    fileObject.end()
                    console.log('success..')
                    fsExtra.readJson(dir + '/template.json', (err, packageObj) => {
                        if (err) console.error(err)
                        console.log(packageObj[type]) // => 0.1.3
                        if (packageObj[type]) {
                            if (type == 'normal') {
                                download.get(dir, name, packageObj[type]);
                            } else if (type == 'admin') {
                                download.get(dir, name, packageObj[type]);
                            } else {
                                GMILOG.E_LOG('No such type')
                            }
                        } else {
                            GMILOG.E_LOG ("no such template,do you mean normal or admin?")
                        }
                    })
                })
            }
        } else {
            GMILOG.E_LOG('Fetch template link error, check the url and please try again.')
        }
        console.log(response.headers['content-type'])
    })
}

download.get = function (dir, name, url) {
    request.get(url).on('response', (response) => {
        if (response.statusCode == 200) {
            // console.log(response.statusCode)
            var len = parseInt(response.headers['content-length'], 10);
            // console.log(len)
            var cur = 0;
            var total = len / 1048576; //1048576 - bytes in  1Megabyte
            if (len <= 0) {
                GMILOG.E_LOG('Download data error.')
            } else {
                var fileObject = fs.createWriteStream(dir + '/' + name + '.zip');
                response.on('data', (data) => {
                    cur += data.length
                    var frame = frames[frames_i = ++frames_i % frames.length];
                    logUpdate(frame + " Downloading " + (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb " + " Total size: " + total.toFixed(2) + " mb");
                    fileObject.write(data)
                }).on('end', (data) => {
                    fileObject.end()
                    decompress(dir + '/' + name + '.zip', dir + '/', {
                        plugins: [
                            decompressUnzip()
                        ]
                    }).then(() => {
                        // console.log('Files decompressed');
                        fsExtra.remove(dir + '/' + name + '.zip')
                            .then(() => {
                                console.log('success!')
                            })
                            .catch(err => {
                                console.error(err)
                            })
                    })
                })
            }
        } else {
            GMILOG.E_LOG('Download error, check the url and please try again.')
        }
        console.log(response.headers['content-type'])
    })
}