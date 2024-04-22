//// [globalThisAmbientModules.ts]
var valueModule;
(function(valueModule) {
    valueModule.val = 1;
})(valueModule || (valueModule = {}));
var bad1 = 'ambientModule';
