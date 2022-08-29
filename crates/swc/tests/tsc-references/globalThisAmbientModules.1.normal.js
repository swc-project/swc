//// [globalThisAmbientModules.ts]
var valueModule;
(function(valueModule) {
    var val = valueModule.val = 1;
})(valueModule || (valueModule = {}));
var bad1 = "ambientModule";
