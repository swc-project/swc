//// [for-of48.ts]
var x, y, E, E1;
for ({ x, y = 0 } of ((E1 = E || (E = {}))[E1.x = 0] = "x", [
    {
        x: "",
        y: !0
    }
]));
