function e(...o) {
    console.log(...o);
}
var o = [
    1,
    2
], l = [
    3,
    4
], s = Math;
if (s) e(o);
else e(l);
if (s) e(...o);
else e(l);
if (s.no_such_property) e(o);
else e(...l);
