function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(G) {
    G[G.A = 1] = "A", G[G.B = 2] = "B", G[G.C = 3] = "C", G[G.D = 2] = "D";
}(G || (G = {})), G.A, G.A, ({
    1: !0
})[G.A];
var G, tmp = G.A, tmp1 = G.B, tmp2 = G.B, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: tmp,
            value: function() {}
        },
        {
            key: tmp1,
            get: function() {
                return !0;
            }
        },
        {
            key: tmp2,
            set: function(x) {}
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
