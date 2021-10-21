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
// adding the var makes this an instantiated module
var M1;
(function(M) {
    M.Point = 1;
})(M1 || (M1 = {
}));
// primary expression
var m;
var m = M1;
var a1;
var a1 = M1.Point;
var a1 = m.Point;
var p1;
var p1;
// making the point a class instead of an interface 
// makes this an instantiated mmodule
var M21;
(function(M2) {
    var Point = /*#__PURE__*/ function() {
        "use strict";
        function Point() {
            _classCallCheck(this, Point);
        }
        _createClass(Point, null, [
            {
                key: "Origin",
                value: function Origin() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            }
        ]);
        return Point;
    }();
    M2.Point = Point;
})(M21 || (M21 = {
}));
var m2;
var m2 = M21;
// static side of the class
var a2;
var a2 = m2.Point;
var a2 = M21.Point;
var o = a2.Origin();
var p2;
var p2;
var p2 = new m2.Point();
var p2 = new M21.Point();
var M31;
(function(M3) {
    var Color1;
    (function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
    })(Color1 || (Color1 = {
    }));
    M3.Color = Color1;
})(M31 || (M31 = {
}));
var m3;
var m3 = M31;
var a3;
var a3 = m3.Color;
var a3 = M31.Color;
var blue = a3.Blue;
var p3;
var p3 = M31.Color.Red;
var p3 = m3.Color.Blue;
