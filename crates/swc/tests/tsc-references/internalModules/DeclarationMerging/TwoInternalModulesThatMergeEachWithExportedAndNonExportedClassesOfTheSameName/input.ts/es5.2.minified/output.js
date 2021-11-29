var A, X;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(A) {
    var Point = function() {
        "use strict";
        _classCallCheck(this, Point);
    };
    A.Point = Point;
}(A || (A = {
})), (function(A) {
    var Point = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function Point() {
            _classCallCheck(this, Point);
        }
        return Constructor = Point, protoProps = [
            {
                key: "fromCarthesian",
                value: function(p) {
                    return {
                        x: p.x,
                        y: p.y
                    };
                }
            }
        ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Point;
    }();
})(A || (A = {
})), (function(X) {
    var Y, Y, Z, Z, Line;
    Y = Y || (Y = {
    }), Z = Z || (Z = {
    }), Line = function() {
        "use strict";
        _classCallCheck(this, Line);
    }, Y.Z = Z, X.Y = Y;
})(X || (X = {
}));
