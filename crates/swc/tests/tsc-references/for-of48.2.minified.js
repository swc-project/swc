//// [for-of48.ts]
var x, y, E;
for ({ x , y =E.x  } of (!function(E) {
    E[E.x = 0] = "x";
}(E || (E = {})), [
    {
        x: "",
        y: !0
    }
]));
