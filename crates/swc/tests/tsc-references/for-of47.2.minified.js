//// [for-of47.ts]
var x, y, E;
for ({ x, y: y = 0 } of ((E = {})[E.x = 0] = "x", [
    {
        x: "",
        y: !0
    }
]));
