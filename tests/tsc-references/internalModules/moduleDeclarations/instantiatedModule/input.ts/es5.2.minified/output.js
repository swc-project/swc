(M || (M = {
})).Point = 1;
var M, m, M21, m2, a2, M31, m3, a3, m = M;
m.Point, (function(M2) {
    var Point = function() {
        "use strict";
        var Constructor;
        function Point() {
            !function(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }(this, Point);
        }
        return (function(target, props) {
            for(var i = 0; i < props.length; i++){
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
            }
        })(Constructor = Point, [
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
    M2.Point = Point;
})(M21 || (M21 = {
}));
var m2 = M21, a2 = m2.Point, a2 = M21.Point;
a2.Origin(), new m2.Point(), new M21.Point(), (function(M3) {
    var Color, Color1;
    (Color1 = Color || (Color = {
    }))[Color1.Blue = 0] = "Blue", Color1[Color1.Red = 1] = "Red", M3.Color = Color;
})(M31 || (M31 = {
}));
var m3 = M31, a3 = m3.Color, a3 = M31.Color;
a3.Blue, M31.Color.Red, m3.Color.Blue;
