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
        })(Utils1 = A.Utils || (A.Utils = {
        }));
    })(A1 = Root1.A || (Root1.A = {
    }));
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
        })(Utils2 = A.Utils || (A.Utils = {
        }));
    })(A2 = otherRoot1.A || (otherRoot1.A = {
    }));
})(otherRoot || (otherRoot = {
}));
