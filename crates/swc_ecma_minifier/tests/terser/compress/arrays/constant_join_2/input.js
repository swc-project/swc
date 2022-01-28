var a = ["foo", "bar", boo(), "baz", "x", "y"].join("");
var b = ["foo", "bar", boo(), "baz", "x", "y"].join("-");
var c = ["foo", "bar", boo(), "baz", "x", "y"].join("really-long-separator");
var d = [
    "foo",
    "bar",
    boo(),
    ["foo", 1, 2, 3, "bar"].join("+"),
    "baz",
    "x",
    "y",
].join("-");
var e = [
    "foo",
    "bar",
    boo(),
    ["foo", 1, 2, 3, "bar"].join("+"),
    "baz",
    "x",
    "y",
].join("really-long-separator");
var f = ["str", "str" + variable, "foo", "bar", "moo" + foo].join("");
