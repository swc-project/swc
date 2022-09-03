//// [classWithStaticFieldInParameterBindingPattern.2.ts]
var _class, _class1;
class C {
}
(({ [((_class = class extends C {
}).x = 1, _class).x]: b = ""  })=>{
    var C1;
})();
const x = "";
(({ [((_class1 = class extends C {
}).x = 1, _class1).x]: b = ""  }, d = "")=>{
    var x;
})();
