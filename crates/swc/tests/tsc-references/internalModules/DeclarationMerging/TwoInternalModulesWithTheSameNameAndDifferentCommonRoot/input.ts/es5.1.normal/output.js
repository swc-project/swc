function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
//@filename: part1.ts
var Root;
(function(Root1) {
    var A1;
    (function(A) {
        var Utils1;
        (function(Utils) {
            function mirror(p) {
                return {
                    x: p.y,
                    y: p.x
                };
            }
            Utils.mirror = mirror;
        })(Utils1 = A.Utils || (A.Utils = {
        }));
    })(A1 = Root1.A || (Root1.A = {
    }));
})(Root || (Root = {
}));
//@filename: part2.ts
var otherRoot;
(function(otherRoot1) {
    var A2;
    (function(A) {
        A.Origin = {
            x: 0,
            y: 0
        };
        var Utils2;
        (function(Utils) {
            var Plane = function Plane(tl, br) {
                "use strict";
                _classCallCheck(this, Plane);
                this.tl = tl;
                this.br = br;
            };
            Utils.Plane = Plane;
        })(Utils2 = A.Utils || (A.Utils = {
        }));
    })(A2 = otherRoot1.A || (otherRoot1.A = {
    }));
})(otherRoot || (otherRoot = {
}));
