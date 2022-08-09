function e(...e) {
    console.log(...e);
}
var f = [
    1,
    2
], i = [
    3,
    4
], l = Math;
if (l) e(f);
else e(i);
if (l) e(...f);
else e(i);
if (l.no_such_property) e(f);
else e(...i);
