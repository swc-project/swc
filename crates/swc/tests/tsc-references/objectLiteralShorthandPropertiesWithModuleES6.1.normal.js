//// [objectLiteralShorthandPropertiesWithModuleES6.ts]
var m;
(function(m) {
    var x1 = m.x = void 0;
})(m || (m = {}));
(function(m) {
    var z = x;
    var y = {
        a: x,
        x
    };
})(m || (m = {}));
