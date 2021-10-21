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
var Point = /*#__PURE__*/ function() {
    "use strict";
    function Point(x, y) {
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    }
    _createClass(Point, null, [
        {
            key: "Origin",
            value: function Origin() {
                return {
                    x: 0,
                    y: 0
                };
            } // unexpected error here bug 840246
        }
    ]);
    return Point;
}();
(function(Point) {
    var Origin = function Origin() {
        return null;
    } //expected duplicate identifier error
    ;
    Point.Origin = Origin;
})(Point || (Point = {
}));
var A1;
(function(A) {
    var Point = /*#__PURE__*/ function() {
        "use strict";
        function Point(x, y) {
            _classCallCheck(this, Point);
            this.x = x;
            this.y = y;
        }
        _createClass(Point, null, [
            {
                key: "Origin",
                value: function Origin() {
                    return {
                        x: 0,
                        y: 0
                    };
                } // unexpected error here bug 840246
            }
        ]);
        return Point;
    }();
    A.Point = Point;
    (function(Point) {
        function Origin() {
            return "";
        } //expected duplicate identifier error
        Point.Origin = Origin;
    })(Point || (Point = {
    }));
})(A1 || (A1 = {
}));
