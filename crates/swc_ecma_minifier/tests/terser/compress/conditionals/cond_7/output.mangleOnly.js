var a, b, c, d, e;
if (b) {
    a = 1 + 1;
} else {
    a = 2;
}
if (b) {
    a = 1 + 1;
} else if (c) {
    a = 2;
} else {
    a = 3 - 1;
}
a = b ? "foo" : "fo" + "o";
a = b ? "foo" : b ? "foo" : "fo" + "o";
if (condition()) {
    a = 10 + 10;
} else {
    a = 20;
}
if (c) {
    a = "fuji";
} else if (condition()) {
    a = "fu" + "ji";
} else {
    a = "fuji";
}
a = condition() ? "foobar" : "foo" + "bar";
a = b ? d : e;
a = b ? "foo" : "fo";
