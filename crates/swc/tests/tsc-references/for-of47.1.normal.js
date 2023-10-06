//// [for-of47.ts]
var x, y;
var array = [
    {
        x: "",
        y: true
    }
];
var E;
(function(E) {
    E[E["x"] = 0] = "x";
})(E || (E = {}));
for ({ x, y: y = 0 } of array){
    x;
    y;
}
