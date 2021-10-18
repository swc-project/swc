function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var c, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C(x) {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), this.x = this, this.x, this.y, this.z, this.foo();
    }
    return protoProps = [
        {
            key: "foo",
            value: function() {
                return this;
            }
        },
        {
            key: "y",
            get: function() {
                return this;
            }
        }
    ], _defineProperties((Constructor = C).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), r = c.x;
c.x.x.x;
var r2 = c.y, r3 = c.foo();
c.z, [
    r,
    r2,
    r3
].forEach(function(x) {
    x.foo, x.x, x.y, x.z;
});
