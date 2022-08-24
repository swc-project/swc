import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var app;
var ctx;
x = function x() {
    var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(app) {
        return {
            schedule: {
                interval: "1m",
                type: "all",
                disable: app.config.env === "local"
            },
            task: function task(ctx) {
                var res, _tmp;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _tmp = {};
                            return [
                                4,
                                ctx.curl("http://www.api.com/cache", (_tmp.contentType = "json", _tmp))
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
