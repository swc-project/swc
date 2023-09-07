//// [globalThisAmbientModules.ts]
var valueModule;
(function(valueModule) {
    var val = 1;
    Object.defineProperty(valueModule, "val", {
        enumerable: true,
        get: function get() {
            return val;
        },
        set: function set(v) {
            val = v;
        }
    });
})(valueModule || (valueModule = {}));
var bad1 = "ambientModule";
