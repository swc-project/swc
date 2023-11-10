//// [mixinAbstractClasses.2.ts]
var baseClass;
const MixedBase = (baseClass = class {
}, class extends baseClass {
    mixinMethod() {}
});
new MixedBase();
