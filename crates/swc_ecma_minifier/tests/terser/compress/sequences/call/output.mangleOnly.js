var n = (function() {
    return this;
})();
function t() {
    console.log("foo");
}
t.c = function() {
    console.log(this === t ? "bar" : "baz");
};
(n, t)();
(n, t.c)();
(n, function() {
    console.log(this === n);
})();
new (n, t)();
new (n, t.c)();
new (n, function() {
    console.log(this === n);
})();
