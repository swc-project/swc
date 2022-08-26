var f, o, e, i, _;
if (o) {
    f = 1 + 1;
} else {
    f = 2;
}
if (o) {
    f = 1 + 1;
} else if (e) {
    f = 2;
} else {
    f = 3 - 1;
}
f = o ? "foo" : "fo" + "o";
f = o ? "foo" : o ? "foo" : "fo" + "o";
if (condition()) {
    f = 10 + 10;
} else {
    f = 20;
}
if (e) {
    f = "fuji";
} else if (condition()) {
    f = "fu" + "ji";
} else {
    f = "fuji";
}
f = condition() ? "foobar" : "foo" + "bar";
f = o ? i : _;
f = o ? "foo" : "fo";
