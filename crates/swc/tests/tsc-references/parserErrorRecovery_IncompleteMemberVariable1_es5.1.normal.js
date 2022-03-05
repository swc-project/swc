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
// Module
var Shapes;
(function(Shapes1) {
    var Point = /*#__PURE__*/ function() {
        "use strict";
        function Point(x, y) {
            _classCallCheck(this, Point);
            this.x = x;
            this.y = y;
        }
        _createClass(Point, [
            {
                // Instance member
                key: "getDist",
                value: function getDist() {
                    return Math.sqrt(this.x * this.x + this.y * this.y);
                }
            }
        ]);
        return Point;
    }();
    // Static member
    Point.origin = new Point(0, 0);
    Shapes1.Point = Point;
})(Shapes || (Shapes = {}));
// Local variables
var p = new Shapes.Point(3, 4);
var dist = p.getDist();
