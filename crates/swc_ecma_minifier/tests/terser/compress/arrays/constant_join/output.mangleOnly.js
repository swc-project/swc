var o = [
    "foo",
    "bar",
    "baz"
].join("");
var a = [
    "foo",
    "bar",
    "baz"
].join();
var r = [
    "foo",
    "bar",
    "baz"
].join(null);
var b = [
    "foo",
    "bar",
    "baz"
].join(void 0);
var n = [
    "foo",
    ,
    "baz"
].join();
var i = [
    "foo",
    null,
    "baz"
].join();
var f = [
    "foo",
    void 0,
    "baz"
].join();
var v = [
    "foo",
    1,
    2,
    3,
    "bar"
].join("");
var j = [
    boo(),
    "foo",
    1,
    2,
    3,
    "bar",
    bar()
].join("");
var z = [
    boo(),
    bar(),
    "foo",
    1,
    2,
    3,
    "bar",
    bar()
].join("");
var l = [
    1,
    2,
    "foo",
    "bar",
    baz()
].join("");
var d = [
    boo() + bar() + "foo",
    1,
    2,
    3,
    "bar",
    bar() + "foo"
].join("");
var u = [
    1,
    2,
    null,
    undefined,
    "foo",
    "bar",
    baz()
].join("");
var e = [
    boo() + bar() + "foo",
    1,
    2,
    3,
    "bar",
    bar() + "foo"
].join();
var c = [
    1,
    2,
    null,
    undefined,
    "foo",
    "bar",
    baz()
].join();
var g = [
    "foo",
    1 + 2 + "bar",
    "baz"
].join("-");
var h = [].join(foo + bar);
var k = [].join("");
var m = [].join("foo");
