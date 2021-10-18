import regeneratorRuntime from "regenerator-runtime";
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "method",
            value: function() {
                var other = function() {
                };
                (function(fn) {
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
                            _next(void 0);
                        });
                    };
                })(regeneratorRuntime.mark(function _callee() {
                    var _args = arguments;
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.next = 2, other.apply(this, _args);
                            case 2:
                                return _ctx.abrupt("return", _ctx.sent);
                            case 3:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee, this);
                }).bind(this)).bind(this);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
