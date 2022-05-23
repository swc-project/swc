var a;
(function f1() {
    a = function () {};
    if (/foo/) console.log(typeof a);
})();
console.log(
    (function f2() {
        a = [];
        return !1;
    })()
);
