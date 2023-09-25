//// [objectLiteralShorthandPropertiesWithModule.ts]
// module export
var m;
(function(m) {})(m || (m = {}));
(function(m) {
    var z = x;
    var y = {
        a: x,
        x: x
    };
})(m || (m = {}));
