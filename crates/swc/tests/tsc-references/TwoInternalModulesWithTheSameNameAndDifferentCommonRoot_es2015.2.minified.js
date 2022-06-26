var Root, otherRoot;
!function(Root) {
    var A;
    ((A = Root.A || (Root.A = {})).Utils || (A.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    };
}(Root || (Root = {})), function(otherRoot) {
    var A;
    (A = otherRoot.A || (otherRoot.A = {})).Origin = {
        x: 0,
        y: 0
    }, (A.Utils || (A.Utils = {})).Plane = class {
        constructor(tl, br){
            this.tl = tl, this.br = br;
        }
    };
}(otherRoot || (otherRoot = {}));
