var A;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
!function(A1) {
    var B, Line, Point = function(x, y) {
        "use strict";
        _classCallCheck(this, Point), this.x = x, this.y = y;
    };
    A1.Point = Point, (B = A1.B || (A1.B = {
    })).Origin = new Point(0, 0), Line = (function() {
        "use strict";
        var Constructor;
        function Line(start, end) {
            _classCallCheck(this, Line);
        }
        return (function(target, props) {
            for(var i = 0; i < props.length; i++){
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
            }
        })(Constructor = Line, [
            {
                key: "fromOrigin",
                value: function(p) {
                    return new Line({
                        x: 0,
                        y: 0
                    }, p);
                }
            }
        ]), Line;
    })(), B.Line = Line;
}(A || (A = {
}));
