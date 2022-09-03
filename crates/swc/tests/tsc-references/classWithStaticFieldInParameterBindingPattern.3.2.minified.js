//// [classWithStaticFieldInParameterBindingPattern.3.ts]
class C {
}
(({ [(class extends C {
    static x = 1;
}).x]: b = ""  })=>{
    var C1;
})();
const x = "";
(({ [(class extends C {
    static x = 1;
}).x]: b = ""  }, d = "")=>{
    var x;
})();
