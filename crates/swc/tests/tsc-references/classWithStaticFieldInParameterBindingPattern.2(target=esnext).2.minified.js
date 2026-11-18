//// [classWithStaticFieldInParameterBindingPattern.2.ts]
class C {
}
(({ [(class extends C {
    static{
        this.x = 1;
    }
}).x]: b = "" })=>{})();
let x = "";
(({ [(class extends C {
    static{
        this.x = 1;
    }
}).x]: b = "" }, d = x)=>{})();
