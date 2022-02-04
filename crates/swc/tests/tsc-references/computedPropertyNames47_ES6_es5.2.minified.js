var E1, E2;
!function(E1) {
    E1[E1.x = 0] = "x";
}(E1 || (E1 = {})), (function(E2) {
    E2[E2.x = 0] = "x";
})(E2 || (E2 = {})), (function(obj, key, value) {
    key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value;
})({}, E1.x || E2.x, 0);
