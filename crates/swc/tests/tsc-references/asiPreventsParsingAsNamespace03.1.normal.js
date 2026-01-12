//// [asiPreventsParsingAsNamespace03.ts]
var namespace;
var n;
(function(container) {
    (function(n // this is the identifier 'n'
    ) {})(n || (n = {}));
    var n;
})(container || (container = {}));
var container;
