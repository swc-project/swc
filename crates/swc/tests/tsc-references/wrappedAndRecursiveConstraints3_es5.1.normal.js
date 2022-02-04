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
var C = // no errors expected
/*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "foo",
            value: function foo(x1) {
                var bar = function bar(x) {
                    return x;
                };
                return bar;
            }
        }
    ]);
    return C;
}();
var c = new C({
    length: 2
});
var r = c.foo({
    length: 3,
    charAt: function(x) {
        '';
    }
});
var r2 = r('');
