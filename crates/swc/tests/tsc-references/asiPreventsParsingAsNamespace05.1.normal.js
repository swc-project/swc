//// [asiPreventsParsingAsNamespace05.ts]
var namespace = 10;
(function(a) {
    (function(b) {
        b.c = 20;
    })(a.b || (a.b = {}));
})(a || (a = {}));
var a;
