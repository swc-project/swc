function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
//@filename: part1.ts
export var A;
(function(A) {
    var Utils;
    (function(Utils) {
        function mirror(p) {
            return {
                x: p.y,
                y: p.x
            };
        }
        Utils.mirror = mirror;
    })(Utils || (Utils = {
    }));
    A.Origin = {
        x: 0,
        y: 0
    };
    A.Utils = Utils;
})(A || (A = {
}));
(function(A) {
    A.Origin = {
        x: 0,
        y: 0
    };
    (function(Utils) {
        var Plane = function Plane(tl, br) {
            "use strict";
            _classCallCheck(this, Plane);
            this.tl = tl;
            this.br = br;
        };
        Utils.Plane = Plane;
    })(Utils || (Utils = {
    }));
})(A || (A = {
}));
