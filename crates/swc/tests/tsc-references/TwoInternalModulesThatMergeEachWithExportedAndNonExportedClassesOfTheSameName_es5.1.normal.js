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
var A;
(function(A1) {
    var Point = function Point() {
        "use strict";
        _classCallCheck(this, Point);
    };
    A1.Point = Point;
})(A || (A = {}));
(function(A) {
    var Point = /*#__PURE__*/ function() {
        "use strict";
        function Point() {
            _classCallCheck(this, Point);
        }
        _createClass(Point, [
            {
                key: "fromCarthesian",
                value: function fromCarthesian(p1) {
                    return {
                        x: p1.x,
                        y: p1.y
                    };
                }
            }
        ]);
        return Point;
    }();
})(A || (A = {}));
// ensure merges as expected
var p;
var p;
var X;
(function(X1) {
    var Y1;
    (function(Y) {
        var Z1;
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _classCallCheck(this, Line);
            };
            Z.Line = Line;
        })(Z1 = Y.Z || (Y.Z = {}));
    })(Y1 = X1.Y || (X1.Y = {}));
})(X || (X = {}));
(function(X2) {
    var Y2;
    (function(Y) {
        var Z;
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _classCallCheck(this, Line);
            };
        })(Z = Y.Z || (Y.Z = {}));
    })(Y2 = X2.Y || (X2.Y = {}));
})(X || (X = {}));
// ensure merges as expected
var l;
var l;
