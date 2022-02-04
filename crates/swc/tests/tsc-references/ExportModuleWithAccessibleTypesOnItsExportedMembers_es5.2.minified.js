var A;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(A1) {
    var B, Line, Point = function(x, y) {
        "use strict";
        _classCallCheck(this, Point), this.x = x, this.y = y;
    };
    A1.Point = Point, (B = A1.B || (A1.B = {})).Origin = new Point(0, 0), Line = (function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function Line(start, end) {
            _classCallCheck(this, Line);
        }
        return Constructor = Line, protoProps = null, staticProps = [
            {
                key: "fromOrigin",
                value: function(p) {
                    return new Line({
                        x: 0,
                        y: 0
                    }, p);
                }
            }
        ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Line;
    })(), B.Line = Line;
}(A || (A = {}));
