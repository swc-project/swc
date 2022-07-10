System.register([], function (_export, _context) {
    "use strict";
    var test, a, b, d;
    const binding = {
        get test() {
            return test;
        },
        set test(v) {
            _export("test", test = v);
        },
        get a() {
            return a;
        },
        set a(v) {
            _export("a", a = v);
        },
        get b() {
            return b;
        },
        set b(v) {
            _export("c", b = v);
        },
        get d() {
            return d;
        },
        set d(v) {
            _export({ e: d = v, f: d });
        },
    };
    return {
        setters: [],
        execute: function () {
            _export("test", test = 2);
            binding.test = 5;
            binding.test++;

            (function () {
                var test = 2;
                test = 3;
                test++;
            })();

            _export("a", a = 2);
            binding.a = 3;

            _export("c", b = 2);
            binding.b = 3;

            _export({
                e: d = 3,
                f: d,
            });
            binding.d = 4;
        },
    };
});
