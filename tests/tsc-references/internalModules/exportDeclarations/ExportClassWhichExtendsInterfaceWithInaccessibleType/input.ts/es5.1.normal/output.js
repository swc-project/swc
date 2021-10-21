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
    var Point2d = /*#__PURE__*/ function() {
        "use strict";
        function Point2d(x, y) {
            _classCallCheck(this, Point2d);
            this.x = x;
            this.y = y;
        }
        _createClass(Point2d, [
            {
                key: "fromOrigin",
                value: function fromOrigin(p) {
                    return 1;
                }
            }
        ]);
        return Point2d;
    }();
    A.Point2d = Point2d;
})(A1 || (A1 = {
}));
