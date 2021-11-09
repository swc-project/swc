function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var A1;
(function(A) {
    var Point = function Point() {
        "use strict";
        _classCallCheck(this, Point);
    };
    A.Point = Point;
})(A1 || (A1 = {
}));
(function(A) {
    var Point = /*#__PURE__*/ function() {
        "use strict";
        function Point() {
            _classCallCheck(this, Point);
        }
        _createClass(Point, [
            {
                key: "fromCarthesian",
                value: function fromCarthesian(p) {
                    return {
                        x: p.x,
                        y: p.y
                    };
                }
            }
        ]);
        return Point;
    }();
})(A1 || (A1 = {
}));
// ensure merges as expected
var p1;
var p1;
var X1;
(function(X) {
    var Y1;
    (function(Y) {
        var Z;
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _classCallCheck(this, Line);
            };
        })(Z || (Z = {
        }));
        Y.Z = Z;
    })(Y1 || (Y1 = {
    }));
    X.Y = Y1;
})(X1 || (X1 = {
}));
// ensure merges as expected
var l;
var l;
