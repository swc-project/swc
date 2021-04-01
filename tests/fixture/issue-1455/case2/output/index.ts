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
    return function () {
        var self = this, args = arguments;
        return new Promise(function (resolve, reject) {
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
    find: function (param) {
        var platform = param.platform;
        return {
            platform: platform
        };
    },
    byPlatform: function (platform) {
        var _byPlatform = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(platform) {
            var result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this.find({
                                platform: {
                                    $eq: platform
                                }
                            });

                        case 2:
                            result = _context.sent;
                            return _context.abrupt("return", result);

                        case 4:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function byPlatform(_x) {
            return _byPlatform.apply(this, arguments);
        }

        return byPlatform;
    }()
};
console.log(obj.byPlatform('foo'));
