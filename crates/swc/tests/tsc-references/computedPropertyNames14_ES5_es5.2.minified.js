function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _b = void 0, _undefined = void 0, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, staticProps = [
        {
            key: !0,
            value: function() {}
        },
        {
            key: {},
            value: function() {}
        },
        {
            key: null,
            value: function() {}
        }
    ], protoProps = [
        {
            key: _b,
            value: function() {}
        },
        {
            key: [],
            value: function() {}
        },
        {
            key: _undefined,
            value: function() {}
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
