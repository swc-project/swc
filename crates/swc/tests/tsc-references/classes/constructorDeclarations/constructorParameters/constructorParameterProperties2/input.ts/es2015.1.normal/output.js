class C {
    constructor(y){
    }
}
var c;
var r = c.y;
class D {
    constructor(y){
        this.y = y;
    }
}
var d;
var r2 = d.y;
class E {
    constructor(y){
        this.y = y;
    }
}
var e;
var r3 = e.y; // error
class F {
    constructor(y){
        this.y = y;
    }
}
var f;
var r4 = f.y; // error
