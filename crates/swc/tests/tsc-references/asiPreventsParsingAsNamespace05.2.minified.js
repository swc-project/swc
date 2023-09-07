//// [asiPreventsParsingAsNamespace05.ts]
var a, a1, b, c;
b = (a1 = a || (a = {})).b || (a1.b = {}), c = 20, Object.defineProperty(b, "c", {
    enumerable: !0,
    get: function() {
        return c;
    },
    set: function(v) {
        c = v;
    }
});
