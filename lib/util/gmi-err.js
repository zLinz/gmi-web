/**
 * Description: Error Handle Util
 * Author: Liam
 * CreatedAt: 2017-1107-1308
 * UpdateBy:
 * UpdateAt:
 */ 

/**
 * A custom GMIError class
 * @class
 */
// class GMIError extends Error {
//     /**
//      * Contructs the GMIError class
//      * @param {string} message an error message
//      * @constructor
//      */
//     constructor (message) {
//         super (message)
//         // properly capture stack trace in Node.js
//         Error.captureStackTrace (this, this,constructor)
//         this.name = this.constructor.name
//     }
// }

// test
// throw new GMIError ('test error!')
// GMIError: test error!

/**
 * Stream eventEmitter
 */ 

var EVENTS = require ('events'),
    GMILOG = require ('./gmi-log')
    

function GMIEvent () {
    EVENTS.EventEmitter.call (this)

    this.GMIError = function () {
        this.emit ('GMIError')
    }
}

GMIEvent.prototype.__proto__ = EVENTS.EventEmitter.prototype

module.exports.GMIEvent = GMIEventInstance = new GMIEvent ()

GMIEventInstance.on ('GMIError', () => {
    GMILOG.E_LOG ('GMIEnevt error!')
})

// test
// GMIEventInstance.GMIError ();
// output: GMIEvent error!