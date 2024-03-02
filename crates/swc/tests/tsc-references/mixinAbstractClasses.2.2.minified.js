//// [mixinAbstractClasses.2.ts]
var baseClass;
new (baseClass = class {
}, class extends baseClass {
    mixinMethod() {}
})();
