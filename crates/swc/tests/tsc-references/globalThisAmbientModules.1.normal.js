//// [globalThisAmbientModules.ts]
(function(valueModule) {
    valueModule.val = 1;
})(valueModule || (valueModule = {}));
(function(namespaceModule) {})(namespaceModule || (namespaceModule = {}));
var bad1 = 'ambientModule';
var valueModule, namespaceModule;
