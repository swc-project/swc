function f() {
    return (
        (function (b) {
            return b;
        })(2) +
        (function h() {
            return h();
        })()
    );
}
