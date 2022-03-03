var M;
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(M1) {
    var _$Symbol, _iterator = _$Symbol.iterator, C = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function C() {
            !function(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }(this, C);
        }
        return Constructor = C, protoProps = [
            {
                key: _iterator,
                value: function() {}
            }
        ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
    }();
    M1.C = C, (new C)[_$Symbol.iterator];
}(M || (M = {})), (new M.C)[Symbol.iterator];
