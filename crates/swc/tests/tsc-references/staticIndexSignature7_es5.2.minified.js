function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var X = function() {
    "use strict";
    _classCallCheck(this, X);
};
X.x = 12;
var Y = function() {
    "use strict";
    var Constructor;
    function Y() {
        _classCallCheck(this, Y);
    }
    return (function(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    })(Constructor = Y, [
        {
            key: "foo",
            value: function() {}
        }
    ]), Y;
}();
