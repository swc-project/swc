var _ts_generator = require("@swc/helpers/_/_ts_generator");
var app;
var ctx;
x = function x1() {
    var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(app) {
        return {
            schedule: {
                interval: '1m',
                type: 'all',
                disable: app.config.env === 'local'
            },
            task: function task(ctx) {
                var res;
                return _ts_generator._(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                ctx.curl('http://www.api.com/cache', {
                                    contentType: 'json'
                                })
                            ];
                        case 1:
                            res = _state.sent();
                            ctx.app.cache = res.data;
                            return [
                                2
                            ];
                    }
                });
            }
        };
    };
};
