var o;
(function n() {
    o = function() {};
    if (/foo/) console.log(typeof o);
})();
console.log((function n() {
    o = [];
    return !1;
})());
