function a(...a) {
    console.log(...a);
}
var b = [
    1,
    2
], c = [
    3,
    4
], d = Math;
if (d) a(b);
else a(c);
if (d) a(...b);
else a(c);
if (d.no_such_property) a(b);
else a(...c);
