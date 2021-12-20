class C {
    constructor(x, z){
        this.x = x;
        this.z = z;
    }
}
var c;
var r = c.y;
var r2 = c.x; // error
var r3 = c.z; // error
class D {
    constructor(a, x, z){
        this.x = x;
        this.z = z;
    }
}
var d;
var r = d.y;
var r2 = d.x; // error
var r3 = d.a; // error
var r4 = d.z; // error
