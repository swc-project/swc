var a = (function () {
    return this;
})();
function b() {
    console.log("foo");
}
b.c = function () {
    console.log(this === b ? "bar" : "baz");
};
(a, b)();
(a, b.c)();
(a,
function () {
    console.log(this === a);
})();
new (a, b)();
new (a, b.c)();
new (a,
function () {
    console.log(this === a);
})();
