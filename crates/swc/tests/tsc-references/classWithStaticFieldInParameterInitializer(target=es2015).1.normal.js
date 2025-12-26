//// [classWithStaticFieldInParameterInitializer.ts]
var _class;
// https://github.com/microsoft/TypeScript/issues/36295
((b = (_class = class {
}, _class.x = 1, _class))=>{})();
