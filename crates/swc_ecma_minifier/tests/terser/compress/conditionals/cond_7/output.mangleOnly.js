var e, _, f, i, l;
if (_) {
    e = 1 + 1;
} else {
    e = 2;
}
if (_) {
    e = 1 + 1;
} else if (f) {
    e = 2;
} else {
    e = 3 - 1;
}
e = _ ? "foo" : "fo" + "o";
e = _ ? "foo" : _ ? "foo" : "fo" + "o";
if (condition()) {
    e = 10 + 10;
} else {
    e = 20;
}
if (f) {
    e = "fuji";
} else if (condition()) {
    e = "fu" + "ji";
} else {
    e = "fuji";
}
e = condition() ? "foobar" : "foo" + "bar";
e = _ ? i : l;
e = _ ? "foo" : "fo";
