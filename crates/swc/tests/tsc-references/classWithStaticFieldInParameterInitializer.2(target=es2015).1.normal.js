//// [classWithStaticFieldInParameterInitializer.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var _class, _class1;
class C {
}
((b = (_class = class extends C {
}, _class.x = 1, _class))=>{
    var C1;
})();
const x = "";
((b = (_class1 = class extends C {
}, _class1.x = 1, _class1), d = x)=>{
    var x1;
})();
