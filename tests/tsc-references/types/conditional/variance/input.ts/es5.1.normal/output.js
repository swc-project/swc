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
var foo = {
    prop: true
};
var x = foo;
var y = foo;
var z = x;
var Bar = // Repro from #30118
/*#__PURE__*/ function() {
    "use strict";
    function Bar() {
        _classCallCheck(this, Bar);
    }
    _createClass(Bar, [
        {
            key: "cast",
            value: function cast(_name) {
            }
        },
        {
            key: "pushThis",
            value: function pushThis() {
                Bar.instance.push(this);
            }
        }
    ]);
    return Bar;
}();
