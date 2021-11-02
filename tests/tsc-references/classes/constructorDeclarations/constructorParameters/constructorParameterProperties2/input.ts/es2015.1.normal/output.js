class C {
    constructor(y){
    }
}
var c;
var r = c.y;
class D {
    constructor(y1){
        this.y = y1;
    }
}
var d;
var r2 = d.y;
class E {
    constructor(y2){
        this.y = y2;
    }
}
var e;
var r3 = e.y; // error
class F {
    constructor(y3){
        this.y = y3;
    }
}
var f;
var r4 = f.y; // error
