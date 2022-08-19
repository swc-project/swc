!function(baseClass) {
    return class extends baseClass {
        mixinMethod() {}
        static staticMixinMethod() {}
    };
}(class {
});
