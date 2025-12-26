//// [classWithStaticFieldInParameterInitializer.ts]
var __ = new WeakMap(), _class;
// https://github.com/microsoft/TypeScript/issues/36295
((b = (_class = class {
}, __.set(_class, {
    writable: true,
    value: this.x = 1
}), _class))=>{})();
