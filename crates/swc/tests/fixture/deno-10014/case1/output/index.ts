import "./errors.ts";
function a() {
    t();
}
function t() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    if (x) {
        throw new Error("Hello");
    }
    t(!0);
}
a();
