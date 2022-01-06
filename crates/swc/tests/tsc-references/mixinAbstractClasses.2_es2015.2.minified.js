var baseClass;
const MixedBase = (baseClass = class {
}, class extends baseClass {
    mixinMethod() {}
});
new MixedBase();
