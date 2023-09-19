//// [asiPreventsParsingAsNamespace05.ts]
var namespace = 10;
var a;
(function(a) {
    (function(b) {
        var c = b.c = 20;
    })(a.b || (a.b = {}));
})(a || (a = {}));
