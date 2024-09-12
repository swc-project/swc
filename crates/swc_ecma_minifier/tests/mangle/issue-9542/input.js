function test() {
    (function (module) {
        function FormatSendData(data) {}
        eval();
    })();

    function n(i) {
        var r1 = t[i];
        if (void 0 !== r1) return r1.exports;
        var o1 = (t[i] = {
            exports: {},
        });
        return e[i](o1, o1.exports, n), o1.exports;
    }
}
test();
