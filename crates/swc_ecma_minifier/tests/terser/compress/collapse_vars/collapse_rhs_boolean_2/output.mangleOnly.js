var o;
(function n() {
    o = function() {};
    if (/foo/) console.log(typeof o);
})();
console.log((function o() {
    o = [];
    return !1;
})());
