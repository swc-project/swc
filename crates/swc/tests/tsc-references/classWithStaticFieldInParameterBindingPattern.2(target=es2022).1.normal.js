//// [classWithStaticFieldInParameterBindingPattern.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
class C {
}
(({ [(class extends C {
    static{
        this.x = 1;
    }
}).x]: b = ""  })=>{
    var C1;
})();
const x = "";
(({ [(class extends C {
    static{
        this.x = 1;
    }
}).x]: b = ""  }, d = x)=>{
    var x1;
})();
