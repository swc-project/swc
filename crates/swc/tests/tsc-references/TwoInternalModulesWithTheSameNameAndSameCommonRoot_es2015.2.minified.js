var A, A1;
((A = A2 || (A2 = {
})).Utils || (A.Utils = {
})).mirror = function(p) {
    return {
        x: p.y,
        y: p.x
    };
}, (A1 = A2 || (A2 = {
})).Origin = {
    x: 0,
    y: 0
}, (A1.Utils || (A1.Utils = {
})).Plane = class {
    constructor(tl, br){
        this.tl = tl, this.br = br;
    }
};
var A2, o, o, o = A2.Origin, o = A2.Utils.mirror(o);
new A2.Utils.Plane(o, {
    x: 1,
    y: 1
});
