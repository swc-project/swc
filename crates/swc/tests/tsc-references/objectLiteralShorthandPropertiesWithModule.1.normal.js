//// [objectLiteralShorthandPropertiesWithModule.ts]
// module export
(function(m) {})(m || (m = {}));
(function(m) {
    var z = m.x;
    var y = {
        a: m.x,
        x: m.x
    };
})(m || (m = {}));
var m;
