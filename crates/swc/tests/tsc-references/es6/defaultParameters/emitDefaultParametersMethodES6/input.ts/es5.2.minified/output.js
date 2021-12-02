function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
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
    function C(t, z, x) {
        arguments.length > 3 && void 0 !== arguments[3] && arguments[3], _classCallCheck(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "foo",
            value: function(x) {
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            }
        },
        {
            key: "foo1",
            value: function(x) {
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)rest[_key - 2] = arguments[_key];
            }
        },
        {
            key: "bar",
            value: function() {
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
            }
        },
        {
            key: "boo",
            value: function() {
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), D = function() {
    "use strict";
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], _classCallCheck(this, D);
}, E = function() {
    "use strict";
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
    _classCallCheck(this, E);
};
