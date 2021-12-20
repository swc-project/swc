// public is allowed on a constructor but is not meaningful
class C {
    constructor(){
    }
}
var c = new C();
var r = c.constructor;
class C2 {
    constructor(x){
    }
}
var c2 = new C2();
var r2 = c2.constructor;
