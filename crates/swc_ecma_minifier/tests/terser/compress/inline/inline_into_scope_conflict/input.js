var mod = pass;
const c = function c() {
    mod();
};
const b = function b() {
    for (;;) {
        c();
        break;
    }
};
(function () {
    var mod = id(mod);
    b();
})();
