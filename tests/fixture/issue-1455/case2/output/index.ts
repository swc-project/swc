function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
var regeneratorRuntime = require("regenerator-runtime");
var obj = {
    find: function(param) {
        var platform = param.platform;
        return {
            platform: platform
        };
    },
    byPlatform: function(platform) {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(platform) {
            var result;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return this.find({
                            platform: {
                                $eq: platform
                            }
                        });
                    case 2:
                        result = _ctx.sent;
                        return _ctx.abrupt("return", result);
                    case 4:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee, this);
        }));
        return function() {
            return _ref.apply(this, arguments);
        };
    }()
};
obj.byPlatform('foo').then(function(v) {
    return console.log(v);
});
