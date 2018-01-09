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


if (fs.existsSync(path.resolve(_dirname, '../projectVersion.js'))) {
    var projectConfig = require(path.resolve(_dirname, '../projectVersion.js'))
}

var download = module.exports = {}

download.request = function (name, dir, type) {
    console.log(type);
    if (projectConfig) {
        if (type == 'normal') {
            download.get(dir, name, projectConfig.normalTemplateUrl);
        } else if (type == 'admin') {
            download.get(dir, name, projectConfig.adminTemplateUrl);
        } else {
            GMILOG.E_LOG('No such type')
        }
    } else {
        GMILOG.E_LOG('No projectConfig.js file')
    }
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