//// [classWithStaticFieldInParameterBindingPattern.2.ts]
var _class, _class1;
class C {
}
(({ [(_class = class extends C {
}, _class.x = 1, _class).x]: b = "" })=>{})();
let x = "";
(({ [(_class1 = class extends C {
}, _class1.x = 1, _class1).x]: b = "" }, d = x)=>{})();
