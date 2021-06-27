function print(...x) {
    console.log(...x);
}
var a = [1, 2],
    b = [3, 4],
    m = Math;
if (m) print(a);
else print(b);
if (m) print(...a);
else print(b);
if (m.no_such_property) print(a);
else print(...b);
