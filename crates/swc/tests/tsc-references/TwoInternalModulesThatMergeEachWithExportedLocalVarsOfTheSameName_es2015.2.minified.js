var A, A1, A2;
((A1 = A || (A = {})).Utils || (A1.Utils = {})).mirror = function(p) {
    return {
        x: p.y,
        y: p.x
    };
}, A1.Origin = {
    x: 0,
    y: 0
}, (A2 = A || (A = {})).Origin = {
    x: 0,
    y: 0
}, (A2.Utils || (A2.Utils = {})).Plane = class {
    constructor(tl, br){
        this.tl = tl, this.br = br;
    }
};
