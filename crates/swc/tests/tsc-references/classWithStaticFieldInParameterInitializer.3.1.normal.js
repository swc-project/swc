//// [classWithStaticFieldInParameterInitializer.3.ts]
// https://github.com/microsoft/TypeScript/issues/36295
class C {
}
((b = class extends C {
    static x = 1;
})=>{
    var C1;
})();
const x = "";
((b = class extends C {
    static x = 1;
}, d = x)=>{
    var x1;
})();
