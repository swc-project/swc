var Shapes1;
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(Shapes) {
    var Point = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function Point(x, y) {
            (function(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            })(this, Point), this.x = x, this.y = y;
        }
        return Constructor = Point, protoProps = [
            {
                key: "getDist",
                value: function() {
                    return Math.sqrt(this.x * this.x + this.y * this.y);
                }
            }
        ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Point;
    }();
    Shapes.Point = Point, Point.origin = new Point(0, 0);
}(Shapes1 || (Shapes1 = {
})), new Shapes1.Point(3, 4).getDist();
