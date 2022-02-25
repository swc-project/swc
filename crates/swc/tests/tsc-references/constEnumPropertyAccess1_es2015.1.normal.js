var // @declaration: true
// @target: es6
// constant enum declarations are completely erased in the emitted JavaScript code.
// it is an error to reference a constant enum object in any other context
// than a property access that selects one of the enum's members
G;
(function(G) {
    G[G["A"] = 1] = "A";
    G[G["B"] = 2] = "B";
    G[G["C"] = 3] = "C";
    G[G["D"] = 2] = "D";
})(G || (G = {}));
var o = {
    1: true
};
var a = 1;
var a1 = 1;
var g = o[1];
var tmp = 1, tmp1 = 2, tmp2 = 2;
class C {
    [tmp]() {}
    get [tmp1]() {
        return true;
    }
    set [tmp2](x) {}
}
