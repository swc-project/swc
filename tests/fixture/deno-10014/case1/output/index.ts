import   "./errors.ts";
function a() {
    t();
}
function t(param) {
    var x = param === void 0 ? false : param;
    if (x) {
        throw new Error("Hello");
    }
    t(!0);
}
a();
