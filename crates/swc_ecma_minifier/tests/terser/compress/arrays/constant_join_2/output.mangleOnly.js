var i = [
    "foo",
    "bar",
    boo(),
    "baz",
    "x",
    "y"
].join("");
var j = [
    "foo",
    "bar",
    boo(),
    "baz",
    "x",
    "y"
].join("-");
var n = [
    "foo",
    "bar",
    boo(),
    "baz",
    "x",
    "y"
].join("really-long-separator");
var o = [
    "foo",
    "bar",
    boo(),
    [
        "foo",
        1,
        2,
        3,
        "bar"
    ].join("+"),
    "baz",
    "x",
    "y", 
].join("-");
var a = [
    "foo",
    "bar",
    boo(),
    [
        "foo",
        1,
        2,
        3,
        "bar"
    ].join("+"),
    "baz",
    "x",
    "y", 
].join("really-long-separator");
var r = [
    "str",
    "str" + variable,
    "foo",
    "bar",
    "moo" + foo
].join("");
