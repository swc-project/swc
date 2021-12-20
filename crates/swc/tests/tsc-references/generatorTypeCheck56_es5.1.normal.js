import regeneratorRuntime from "regenerator-runtime";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var _marked = regeneratorRuntime.mark(g);
//@target: ES6
function g() {
    var x;
    return regeneratorRuntime.wrap(function g$(_ctx1) {
        while(1)switch(_ctx1.prev = _ctx1.next){
            case 0:
                x = (function() {
                    var tmp = yield 0;
                    var C = /*#__PURE__*/ function() {
                        "use strict";
                        function C() {
                            _classCallCheck(this, C);
                        }
                        _createClass(C, [
                            {
                                key: tmp,
                                value: regeneratorRuntime.mark(function value() {
                                    return regeneratorRuntime.wrap(function value$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                _ctx.next = 2;
                                                return 0;
                                            case 2:
                                            case "end":
                                                return _ctx.stop();
                                        }
                                    }, value);
                                })
                            }
                        ]);
                        return C;
                    }();
                    return C;
                })();
            case 1:
            case "end":
                return _ctx1.stop();
        }
    }, _marked);
}
