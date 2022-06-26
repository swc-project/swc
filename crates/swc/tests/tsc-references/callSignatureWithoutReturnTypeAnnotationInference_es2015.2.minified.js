var M, e1;
function foo3() {
    return foo3();
}
function m1() {
    return 1;
}
foo3(), function(M) {
    M.x = 1, M.C = class {
    };
}(M || (M = {})), (m1 || (m1 = {})).y = 2;
class c1 {
    constructor(x){}
}
(c1 || (c1 = {})).x = 1, function(e1) {
    e1[e1.A = 0] = "A";
}(e1 || (e1 = {})), (e1 || (e1 = {})).y = 1;
