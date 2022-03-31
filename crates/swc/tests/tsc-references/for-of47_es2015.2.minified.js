var x, y;
for ({ x , y: y = E.x  } of (!function(E) {
    E[E.x = 0] = "x";
}(E || (E = {})), [
    {
        x: "",
        y: !0
    }
]));
