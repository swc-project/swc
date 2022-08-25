import regeneratorRuntime from "regenerator-runtime";
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
            task: regeneratorRuntime.mark(function task(ctx) {
                var res;
                return regeneratorRuntime.wrap(function task$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            _ctx.next = 2;
                            return ctx.curl("http://www.api.com/cache", {
                                contentType: "json"
                            });
                        case 2:
                            res = _ctx.sent;
                            ctx.app.cache = res.data;
                        case 4:
                        case "end":
                            return _ctx.stop();
                    }
                }, task);
            })
        };
    };
};
