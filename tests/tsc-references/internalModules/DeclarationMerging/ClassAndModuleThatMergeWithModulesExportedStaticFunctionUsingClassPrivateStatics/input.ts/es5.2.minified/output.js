function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var clodule1 = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function clodule1() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, clodule1);
    }
    return Constructor = clodule1, protoProps = null, staticProps = [
        {
            key: "sfn",
            value: function(id) {
                return 42;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), clodule1;
}();
!function(clodule) {
    var fn = function(x, y) {
        return clodule1.sfn("a");
    };
    clodule.fn = fn;
}(clodule1 || (clodule1 = {
}));
