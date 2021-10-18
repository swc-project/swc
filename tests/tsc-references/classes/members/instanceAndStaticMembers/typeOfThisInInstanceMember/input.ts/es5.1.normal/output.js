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
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        _classCallCheck(this, C);
        this.x = this;
        var t = this;
        t.x;
        t.y;
        t.z;
        var r = t.foo();
    }
    _createClass(C, [
        {
            key: "foo",
            value: function foo() {
                return this;
            }
        },
        {
            key: "y",
            get: function get() {
                return this;
            }
        }
    ]);
    return C;
}();
var c;
// all ok
var r = c.x;
var ra = c.x.x.x;
var r2 = c.y;
var r3 = c.foo();
var rs = [
    r,
    r2,
    r3
];
rs.forEach(function(x) {
    x.foo;
    x.x;
    x.y;
});
