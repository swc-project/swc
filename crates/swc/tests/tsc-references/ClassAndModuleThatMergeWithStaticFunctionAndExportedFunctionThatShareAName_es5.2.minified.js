function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var A, Point = function() {
    "use strict";
    function Point(x, y) {
        _classCallCheck(this, Point), this.x = x, this.y = y;
    }
    return _createClass(Point, null, [
        {
            key: "Origin",
            value: function() {
                return {
                    x: 0,
                    y: 0
                };
            }
        }
    ]), Point;
}();
(Point || (Point = {
})).Origin = function() {
    return null;
}, (function(A1) {
    var Point = function() {
        "use strict";
        function Point(x, y) {
            _classCallCheck(this, Point), this.x = x, this.y = y;
        }
        return _createClass(Point, null, [
            {
                key: "Origin",
                value: function() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            }
        ]), Point;
    }();
    A1.Point = Point, (Point = A1.Point || (A1.Point = {
    })).Origin = function() {
        return "";
    };
})(A || (A = {
}));
