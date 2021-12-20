// all of these valueOf calls should return the type shown in the overriding signatures here
class C {
    valueOf() {
    }
}
var c;
var r1 = c.valueOf();
var i;
var r2 = i.valueOf();
var a = {
    valueOf: ()=>{
    }
};
var r3 = a.valueOf();
var b;
var r4 = b.valueOf();
