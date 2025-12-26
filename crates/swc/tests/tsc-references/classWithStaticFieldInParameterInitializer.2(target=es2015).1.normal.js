//// [classWithStaticFieldInParameterInitializer.2.ts]
var __ = new WeakMap(), _class, __1 = new WeakMap(), _class1;
// https://github.com/microsoft/TypeScript/issues/36295
class C {
}
((b = (_class = class extends C {
}, __.set(_class, {
    writable: true,
    value: this.x = 1
}), _class))=>{
    var C1;
})();
const x = "";
((b = (_class1 = class extends C {
}, __1.set(_class1, {
    writable: true,
    value: this.x = 1
}), _class1), d = x)=>{
    var x1;
})();
