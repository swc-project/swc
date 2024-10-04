//// [for-of48.ts]
var x, y;
var array = [
    {
        x: "",
        y: true
    }
];
var E = /*#__PURE__*/ function(E) {
    E[E["x"] = 0] = "x";
    return E;
}(E || {});
for ({ x, y = 0 } of array){
    x;
    y;
}
