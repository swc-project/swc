class C {
}
class D {
}
class E {
}
class F extends C {
}
class C1 {
    constructor(){
        this.i = "foo";
    }
}
class D1 extends C1 {
    constructor(...args){
        super(...args);
        this.i = "bar";
    }
}
var t1;
var t2;
var t3;
var t4;
var t5;
var e11 = t1[4]; // base
var e21 = t2[4]; // {}
var e31 = t3[4]; // C1
var e41 = t4[2]; // base1
var e51 = t5[2]; // {}
