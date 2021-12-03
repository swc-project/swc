(M || (M = {
})).Point = 1;
var M, m, M2, m2, a2, M3, m3, a3, m = M;
m.Point, (function(M21) {
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
    M21.Point = Point;
})(M2 || (M2 = {
}));
var m2 = M2, a2 = m2.Point, a2 = M2.Point;
a2.Origin(), new m2.Point(), new M2.Point(), (function(M31) {
    var Color, Color1;
    (Color1 = Color || (Color = {
    }))[Color1.Blue = 0] = "Blue", Color1[Color1.Red = 1] = "Red", M31.Color = Color;
})(M3 || (M3 = {
}));
var m3 = M3, a3 = m3.Color, a3 = M3.Color;
a3.Blue, M3.Color.Red, m3.Color.Blue;
