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
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    A1.Point = Point;
    var B1;
    (function(B) {
        var Origin = B.Origin = new Point(0, 0);
        var Line = /*#__PURE__*/ function() {
            "use strict";
            function Line(start, end) {
                _classCallCheck(this, Line);
            }
            _createClass(Line, null, [
                {
                    key: "fromOrigin",
                    value: function fromOrigin(p) {
                        return new Line({
                            x: 0,
                            y: 0
                        }, p);
                    }
                }
            ]);
            return Line;
        }();
        B.Line = Line;
    })(B1 = A1.B || (A1.B = {
    }));
})(A || (A = {
}));
