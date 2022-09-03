//// [asiPreventsParsingAsNamespace05.ts]
var a, namespace = 10;
!function(a) {
    (a.b || (a.b = {})).c = 20;
}(a || (a = {}));
