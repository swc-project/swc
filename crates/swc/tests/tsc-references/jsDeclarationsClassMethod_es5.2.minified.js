function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function C1() {
    this.prop = function(x, y) {
        return x + y;
    };
}
C1.prototype.method = function(x, y) {
    return x + y;
}, C1.staticProp = function(x, y) {
    return x + y;
};
var C2 = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C2() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C2);
    }
    return Constructor = C2, protoProps = [
        {
            key: "method1",
            value: function(x, y) {
                return x + y;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C2;
}();
C2.prototype.method2 = function(x, y) {
    return x + y;
}, C2.staticProp = function(x, y) {
    return x + y;
};
