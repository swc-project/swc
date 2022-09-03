//// [classWithStaticFieldInParameterInitializer.2.ts]
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
}, d = "")=>{
    var x;
})();
