var E;
!function(E) {
    E[E.member = 0] = "member";
}(E || (E = {})), (function(obj, key, value) {
    key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value;
})({}, E.member, 0);
