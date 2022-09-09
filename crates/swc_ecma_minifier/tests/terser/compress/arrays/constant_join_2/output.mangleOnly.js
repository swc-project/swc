var o = ["foo", "bar", boo(), "baz", "x", "y"].join("");
var a = ["foo", "bar", boo(), "baz", "x", "y"].join("-");
var r = ["foo", "bar", boo(), "baz", "x", "y"].join("really-long-separator");
var b = [
    "foo",
    "bar",
    boo(),
    ["foo", 1, 2, 3, "bar"].join("+"),
    "baz",
    "x",
    "y",
].join("-");
var n = [
    "foo",
    "bar",
    boo(),
    ["foo", 1, 2, 3, "bar"].join("+"),
    "baz",
    "x",
    "y",
].join("really-long-separator");
var f = ["str", "str" + variable, "foo", "bar", "moo" + foo].join("");
