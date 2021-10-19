// @declaration: true
class C {
    constructor(){
    }
}
var c = new C(); // error C is private
var r = c.constructor;
class C2 {
    constructor(x){
    }
}
var c2 = new C2(); // error C2 is private
var r2 = c2.constructor;
