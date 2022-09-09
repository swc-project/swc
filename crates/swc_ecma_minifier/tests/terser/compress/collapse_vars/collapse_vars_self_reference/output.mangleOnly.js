function n() {
    var n = {
        inner: function () {
            return n;
        },
    };
}
function r() {
    var n = { inner: n };
}
