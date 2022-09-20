//// [for-of47.ts]
var x, y, E;
!function(E) {
    E[E.x = 0] = "x";
}(E || (E = {}));
for ({ x , y: y = E.x  } of [
    {
        x: "",
        y: !0
    }
]);
