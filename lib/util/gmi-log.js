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
    console.log ('\x1b[36m' + 'N_OUTPUT:\r\n\t' + '%s\x1b[0m', str)
}

// Error Log - FgRed
gmilog.E_LOG = function (err) {
    console.log ('\x1b[31m' + 'E_OUTPUT:\r\n\t' + '%s\x1b[0m', err);
}