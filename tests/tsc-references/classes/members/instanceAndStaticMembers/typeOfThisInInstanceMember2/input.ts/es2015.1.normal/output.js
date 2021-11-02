class C {
    foo() {
        return this;
    }
    get y() {
        return this;
    }
    constructor(x1){
        this.x = this;
        var t = this;
        t.x;
        t.y;
        t.z;
        var r = t.foo();
    }
}
var c;
// all ok
var r = c.x;
var ra = c.x.x.x;
var r2 = c.y;
var r3 = c.foo();
var r4 = c.z;
var rs = [
    r,
    r2,
    r3
];
rs.forEach((x)=>{
    x.foo;
    x.x;
    x.y;
    x.z;
});
