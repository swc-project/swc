//// [objectLiteralShorthandPropertiesWithModule.ts]
// module export
(function(m) {})(m || (m = {}));
(function(m) {
    var z = x;
    var y = {
        a: x,
        x: x
    };
})(m || (m = {}));
var m;
