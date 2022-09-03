//// [for-of47.ts]
var x, y, E, array = [
    {
        x: "",
        y: !0
    }
];
for ({ x , y: y = E.x  } of (!function(E) {
    E[E.x = 0] = "x";
}(E || (E = {})), array));
