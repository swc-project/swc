//@filename: part1.ts
var Root;
(function(Root) {
    let A;
    (function(A) {
        let Utils;
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
        A.Utils = Utils;
    })(A || (A = {
    }));
    Root.A = A;
})(Root || (Root = {
}));
//@filename: part2.ts
var otherRoot;
(function(otherRoot) {
    let A;
    (function(A) {
        A.Origin = {
            x: 0,
            y: 0
        };
        let Utils;
        (function(Utils) {
            class Plane {
                constructor(tl, br){
                    this.tl = tl;
                    this.br = br;
                }
            }
            Utils.Plane = Plane;
        })(Utils || (Utils = {
        }));
        A.Utils = Utils;
    })(A || (A = {
    }));
    otherRoot.A = A;
})(otherRoot || (otherRoot = {
}));
