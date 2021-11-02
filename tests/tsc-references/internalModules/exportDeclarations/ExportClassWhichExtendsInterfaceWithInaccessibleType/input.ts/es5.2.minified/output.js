var A1;
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(A) {
    var Point2d = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function Point2d(x, y) {
            !function(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }(this, Point2d), this.x = x, this.y = y;
        }
        return Constructor = Point2d, protoProps = [
            {
                key: "fromOrigin",
                value: function(p) {
                    return 1;
                }
            }
        ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Point2d;
    }();
    A.Point2d = Point2d;
}(A1 || (A1 = {
}));
