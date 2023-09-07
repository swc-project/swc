//// [asiPreventsParsingAsNamespace05.ts]
var namespace = 10;
var a;
(function(a) {
    (function(b) {
        var c = 20;
        Object.defineProperty(b, "c", {
            enumerable: true,
            get: function get() {
                return c;
            },
            set: function set(v) {
                c = v;
            }
        });
    })(a.b || (a.b = {}));
})(a || (a = {}));
