function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(G) {
    G[G.A = 1] = "A", G[G.B = 2] = "B", G[G.C = 3] = "C", G[G.D = 2] = "D";
}(G || (G = {})), ({
    1: !0
})[1];
var G, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: 1,
            value: function() {}
        },
        {
            key: 2,
            get: function() {
                return !0;
            }
        },
        {
            key: 2,
            set: function(x) {}
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
