var o = (function () {
    return this;
})();
function n() {
    console.log("foo");
}
n.c = function () {
    console.log(this === n ? "bar" : "baz");
};
(o, n)();
(o, n.c)();
(o,
function () {
    console.log(this === o);
})();
new (o, n)();
new (o, n.c)();
new (o,
function () {
    console.log(this === o);
})();
