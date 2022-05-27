var a;
(function b() {
    a = function() {};
    if (/foo/) console.log(typeof a);
})();
console.log((function b() {
    a = [];
    return !1;
})());
