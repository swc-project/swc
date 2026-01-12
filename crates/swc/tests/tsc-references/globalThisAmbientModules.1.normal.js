//// [globalThisAmbientModules.ts]
(function(valueModule) {
    valueModule.val = 1;
})(valueModule || (valueModule = {}));
var bad1 = 'ambientModule';
var valueModule;
