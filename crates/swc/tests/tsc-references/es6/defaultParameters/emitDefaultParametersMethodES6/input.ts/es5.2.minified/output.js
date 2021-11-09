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
    function C(t, z, x, param) {
        _classCallCheck(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "foo",
            value: function(x, param) {
            }
        },
        {
            key: "foo1",
            value: function(x, param) {
                for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)rest[_key - 2] = arguments[_key];
            }
        },
        {
            key: "bar",
            value: function(param) {
            }
        },
        {
            key: "boo",
            value: function(param) {
                for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), D = function(param) {
    "use strict";
    _classCallCheck(this, D);
}, E = function(param) {
    "use strict";
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
    _classCallCheck(this, E);
};
