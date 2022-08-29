//// [mixinAbstractClasses.2.ts]
const MixedBase = function(baseClass) {
    return class extends baseClass {
        mixinMethod() {}
    };
}(class {
});
new MixedBase();
