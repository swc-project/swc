function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var methodName = "method", accessorName = "accessor", _methodName = methodName, _methodName1 = methodName, _accessorName = accessorName, _accessorName1 = accessorName, _accessorName2 = accessorName, _accessorName3 = accessorName, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: _methodName,
            value: function() {}
        },
        {
            key: _accessorName,
            get: function() {}
        },
        {
            key: _accessorName1,
            set: function(v) {}
        }
    ], staticProps = [
        {
            key: _methodName1,
            value: function() {}
        },
        {
            key: _accessorName2,
            get: function() {}
        },
        {
            key: _accessorName3,
            set: function(v) {}
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
