var Root, otherRoot;
!function(Root1) {
    var A;
    ((A = Root1.A || (Root1.A = {})).Utils || (A.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    };
}(Root || (Root = {})), function(otherRoot1) {
    var A;
    (A = otherRoot1.A || (otherRoot1.A = {})).Origin = {
        x: 0,
        y: 0
    }, (A.Utils || (A.Utils = {})).Plane = class {
        constructor(tl, br){
            this.tl = tl, this.br = br;
        }
    };
}(otherRoot || (otherRoot = {}));
