//@filename: part1.ts
var Root;
(function(Root1) {
    let A1;
    (function(A) {
        let Utils1;
        (function(Utils) {
            function mirror(p) {
                return {
                    x: p.y,
                    y: p.x
                };
            }
            Utils.mirror = mirror;
        })(Utils1 || (Utils1 = {
        }));
        A.Utils = Utils1;
    })(A1 || (A1 = {
    }));
    Root1.A = A1;
})(Root || (Root = {
}));
//@filename: part2.ts
var otherRoot;
(function(otherRoot1) {
    let A2;
    (function(A) {
        A.Origin = {
            x: 0,
            y: 0
        };
        let Utils2;
        (function(Utils) {
            class Plane {
                constructor(tl, br){
                    this.tl = tl;
                    this.br = br;
                }
            }
            Utils.Plane = Plane;
        })(Utils2 || (Utils2 = {
        }));
        A.Utils = Utils2;
    })(A2 || (A2 = {
    }));
    otherRoot1.A = A2;
})(otherRoot || (otherRoot = {
}));
