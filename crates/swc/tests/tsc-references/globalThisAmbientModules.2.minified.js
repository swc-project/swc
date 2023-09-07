//// [globalThisAmbientModules.ts]
var valueModule, valueModule1, val;
valueModule1 = valueModule || (valueModule = {}), val = 1, Object.defineProperty(valueModule1, "val", {
    enumerable: !0,
    get: function() {
        return val;
    },
    set: function(v) {
        val = v;
    }
});
