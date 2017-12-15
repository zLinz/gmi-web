/**
 * Description: Error Handle Util
 * Author: Liam
 * CreatedAt: 2017-1107-1222
 * UpdateBy:
 * UpdateAt:
 */ 

// Export gmilog to orther modules
gmilog = module.exports = {}

// Normal Log - FgCyan
gmilog.N_LOG = function (str) {
    if (typeof str != "string") {
        console.log ('\x1b[36m' + 'N_OUTPUT:\r\n\t' + '%s\x1b[0m', JSON.stringify (str))
    } else {
        console.log ('\x1b[36m' + 'N_OUTPUT:\r\n\t' + '%s\x1b[0m', str)
    }
    // console.trace ()
}

// Error Log - FgRed
gmilog.E_LOG = function (err) {
    if (typeof str != "string") {
        console.log ('\x1b[31m' + 'E_OUTPUT:\r\n\t' + '%s\x1b[0m', JSON.stringify (err))
    } else {
        console.log ('\x1b[31m' + 'E_OUTPUT:\r\n\t' + '%s\x1b[0m', err)
    }
    console.trace ()
}