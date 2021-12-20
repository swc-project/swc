// @skipDefaultLibCheck: false
class A {
}
class B extends A {
}
class C {
    valueOf() {
    }
}
var c;
var r1 = c.valueOf();
var r1b = c.data;
var r1c = r1b['hm']; // should be 'Object'
var r1d = c['hm']; // should be 'any'
var i;
var r2 = i.valueOf();
var r2b = i.data;
var r2c = r2b['hm']; // should be 'Object'
var r2d = i['hm']; // should be 'any'
var a = {
    valueOf: ()=>{
    },
    data: new B()
};
var r3 = a.valueOf();
var r3b = a.data;
var r3c = r3b['hm']; // should be 'Object'
var r3d = i['hm'];
var b;
var r4 = b.valueOf();
