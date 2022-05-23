class C {
}
function f1() {}
var M;
(function(M1) {
    var y = M1.y = 1;
})(M || (M = {}));
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
var a = {
    a: 1,
    b: '',
    c: true,
    d: {},
    e: null,
    f: [
        1
    ],
    g: {},
    h: (x)=>1,
    i: (x)=>x,
    j: null,
    k: new C(),
    l: f1,
    m: M,
    n: {},
    o: E.A
};
