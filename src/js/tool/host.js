(function($) {
    var Host = {
        // 获取TOKEN
        main: "http://hqgzh.fjny.edu.cn/apach/api/",
        rcmain: "http://hqgzh.fjny.edu.cn/apach/api/",
        salt: "logistics",
        interface: {
                user: {
                    register: 'user/register',
                    login: 'user/login',
                    myinfo: 'user/myinfo',
                    logout: 'user/logout',
                    getUsernameByOpenid: 'user/getUsernameByOpenid'
                },
                notice: {
                    query: 'notice/query',
                    getById: function(id) {
                        return 'notice/' + id + '/getById';
                    }
                },
                message: {
                    query: 'message/query',
                    add: 'message/add',
                    deletemessage: function(id) {
                        return 'message/' + id + '/del';
                    }
                },
                repair: {
                    query: 'repair/query',
                    getById: function(id) {
                        return 'repair/' + id + '/getById';
                    },
                    add: 'repair/add'
                },
                minerepair: {
                    query: 'repair/query',
                    getById: function(id) {
                        return 'repair/' + id + '/getById';
                    },
                    deleterepair: function(id) {
                        return 'repair/' + id + '/delete';
                    },
                    complete: function(id) {
                        return 'repair/' + id + '/minecomplete';
                    },
                },
                minelost: {
                    query: 'lost/query',
                    getById: function(id) {
                        return 'lost/' + id + '/getById';
                    },
                    deletelost: function(id) {
                        return 'lost/' + id + '/delete';
                    },
                    setStatus: function(id) {
                        return 'lost/' + id + '/set_status';
                    }
                },
                minemessage: {
                    query: 'message/query',
                    getById: function(id) {
                        return 'message/' + id + '/getById';
                    },
                    deletemessage: function(id) {
                        return 'message/' + id + '/delete';
                    }
                },
                lost: {
                    query: 'lost/query',
                    getById: function(id) {
                        return 'lost/' + id + '/getById';
                    },
                    add: 'lost/release'
                },
                file: {
                    upload: 'file/upload'
                },
                worker: {
                    type: 'worker/type',
                    login: 'worker/login',
                    query: function(id) {
                        return 'worker/' + id + '/getRepair';
                    },
                    getUsernameByOpenid: 'worker/loginByOpenid',
                    complete: function(id) {
                        return 'repair/' + id + '/workercomplete';
                    },
                    workerGot: function(id) {
                        return 'repair/' + id + '/workerGot';
                    }
                }
        }
    };
    module.exports = Host;
})(window.jQuery);
