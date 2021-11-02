import regeneratorRuntime from "regenerator-runtime";
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
var _marked = regeneratorRuntime.mark(function() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx1) {
        for(;;)switch(_ctx1.prev = _ctx1.next){
            case 0:
                x = (function() {
                    var tmp = yield 0, C = function() {
                        "use strict";
                        function C() {
                            _classCallCheck(this, C);
                        }
                        return _createClass(C, [
                            {
                                key: tmp,
                                value: regeneratorRuntime.mark(function value() {
                                    return regeneratorRuntime.wrap(function(_ctx) {
                                        for(;;)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.next = 2, 0;
                                            case 2:
                                            case "end":
                                                return _ctx.stop();
                                        }
                                    }, value);
                                })
                            }
                        ]), C;
                    }();
                    return C;
                })();
            case 1:
            case "end":
                return _ctx1.stop();
        }
    }, _marked);
});
