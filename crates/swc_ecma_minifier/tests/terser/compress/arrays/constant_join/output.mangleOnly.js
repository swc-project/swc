var a = [
    "foo",
    "bar",
    "baz"
].join("");
var b = [
    "foo",
    "bar",
    "baz"
].join();
var c = [
    "foo",
    "bar",
    "baz"
].join(null);
var d = [
    "foo",
    "bar",
    "baz"
].join(void 0);
var e = [
    "foo",
    ,
    "baz"
].join();
var f = [
    "foo",
    null,
    "baz"
].join();
var g = [
    "foo",
    void 0,
    "baz"
].join();
var h = [
    "foo",
    1,
    2,
    3,
    "bar"
].join("");
var i = [
    boo(),
    "foo",
    1,
    2,
    3,
    "bar",
    bar()
].join("");
var j = [
    boo(),
    bar(),
    "foo",
    1,
    2,
    3,
    "bar",
    bar()
].join("");
var k = [
    1,
    2,
    "foo",
    "bar",
    baz()
].join("");
var l = [
    boo() + bar() + "foo",
    1,
    2,
    3,
    "bar",
    bar() + "foo"
].join("");
var m = [
    1,
    2,
    null,
    undefined,
    "foo",
    "bar",
    baz()
].join("");
var n = [
    boo() + bar() + "foo",
    1,
    2,
    3,
    "bar",
    bar() + "foo"
].join();
var o = [
    1,
    2,
    null,
    undefined,
    "foo",
    "bar",
    baz()
].join();
var p = [
    "foo",
    1 + 2 + "bar",
    "baz"
].join("-");
var q = [].join(foo + bar);
var r = [].join("");
var s = [].join("foo");
