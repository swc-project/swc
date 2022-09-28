var o, f, i, e, l;
if (f) {
    o = 1 + 1;
} else {
    o = 2;
}
if (f) {
    o = 1 + 1;
} else if (i) {
    o = 2;
} else {
    o = 3 - 1;
}
o = f ? "foo" : "fo" + "o";
o = f ? "foo" : f ? "foo" : "fo" + "o";
if (condition()) {
    o = 10 + 10;
} else {
    o = 20;
}
if (i) {
    o = "fuji";
} else if (condition()) {
    o = "fu" + "ji";
} else {
    o = "fuji";
}
o = condition() ? "foobar" : "foo" + "bar";
o = f ? e : l;
o = f ? "foo" : "fo";
