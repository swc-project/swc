class AbstractBase {
}
const MixedBase = function(baseClass) {
    return class extends baseClass {
        mixinMethod() {}
    };
}(AbstractBase);
new MixedBase();
