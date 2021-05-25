!(function f(a) {
    return a && f(a - 1) + a;
})(42);
!void 0;
