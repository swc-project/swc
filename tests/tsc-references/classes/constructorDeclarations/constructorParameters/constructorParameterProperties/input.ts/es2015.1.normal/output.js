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
    constructor(a, x1, z1){
        this.x = x1;
        this.z = z1;
    }
}
var d;
var r = d.y;
var r2 = d.x; // error
var r3 = d.a; // error
var r4 = d.z; // error
