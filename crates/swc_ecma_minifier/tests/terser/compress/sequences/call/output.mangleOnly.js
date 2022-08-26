var n = (function() {
    return this;
})();
function o() {
    console.log("foo");
}
o.c = function() {
    console.log(this === o ? "bar" : "baz");
};
(n, o)();
(n, o.c)();
(n, function() {
    console.log(this === n);
})();
new (n, o)();
new (n, o.c)();
new (n, function() {
    console.log(this === n);
})();
