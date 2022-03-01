function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var s, n, a, _s = s, _n = n, tmp = s + s, tmp1 = s + n, tmp2 = +s, _a = a, tmp3 = "hello ".concat(a, " bye"), C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: _s,
            value: function() {}
        },
        {
            key: _n,
            value: function() {}
        },
        {
            key: tmp1,
            value: function() {}
        },
        {
            key: tmp2,
            value: function() {}
        },
        {
            key: 0,
            value: function() {}
        },
        {
            key: _a,
            value: function() {}
        },
        {
            key: "hello bye",
            value: function() {}
        }
    ], staticProps = [
        {
            key: tmp,
            value: function() {}
        },
        {
            key: "",
            value: function() {}
        },
        {
            key: !0,
            value: function() {}
        },
        {
            key: tmp3,
            value: function() {}
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
