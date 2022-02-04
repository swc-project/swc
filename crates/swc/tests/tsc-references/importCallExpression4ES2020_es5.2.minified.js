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
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
export var B = function() {
    "use strict";
    function B() {
        _classCallCheck(this, B);
    }
    return _createClass(B, [
        {
            key: "print",
            value: function() {
                return "I am B";
            }
        }
    ]), B;
}();
export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
var C = function() {
    "use strict";
    function C() {
        _classCallCheck(this, C), this.myModule = import("./0");
    }
    return _createClass(C, [
        {
            key: "method",
            value: function() {
                var fn, _ref;
                import("./0"), this.myModule.then(function(Zero) {
                    console.log(Zero.foo());
                }, (fn = regeneratorRuntime.mark(function _callee(err) {
                    var one;
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return console.log(err), _ctx.next = 3, import("./1");
                            case 3:
                                one = _ctx.sent, console.log(one.backup());
                            case 5:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }), _ref = function() {
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
                }, function(err) {
                    return _ref.apply(this, arguments);
                }));
            }
        }
    ]), C;
}();
