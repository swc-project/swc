//// [classWithStaticFieldInParameterBindingPattern.3.ts]
class C {
}
(({ [(class extends C {
    static x = 1;
}).x]: b = "" })=>{})();
let x = "";
(({ [(class extends C {
    static x = 1;
}).x]: b = "" }, d = x)=>{})();
