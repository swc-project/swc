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
var _class, A = function() {
    "use strict";
    _classCallCheck(this, A);
};
(_class = (function() {
    "use strict";
    function B() {
        _classCallCheck(this, B);
    }
    return _createClass(B, null, [
        {
            key: "func2",
            value: function() {
                return new Promise(function(resolve) {
                    resolve(null);
                });
            }
        }
    ]), B;
})()).C = (function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    return _createClass(C, null, [
        {
            key: "func",
            value: function() {
                return (function(fn) {
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
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.next = 2, _class.func2();
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]), C;
})(), A.B = _class, A.B.C.func();
