function foo(x, y, ...z) {
}
var a;
var z;
var obj;
var xa1;
foo(1, 2, "abc");
foo(1, 2, ...a);
foo(1, 2, ...a, "abc");
obj.foo(1, 2, "abc");
obj.foo(1, 2, ...a);
obj.foo(1, 2, ...a, "abc");
obj.foo(1, 2, "abc");
obj.foo(1, 2, ...a);
obj.foo(1, 2, ...a, "abc");
xa1[1].foo(1, 2, "abc");
xa1[1].foo(1, 2, ...a);
xa1[1].foo(1, 2, ...a, "abc");
xa[1].foo(...[
    1,
    2,
    "abc"
]);
class C {
    foo(x, y, ...z) {
    }
    constructor(x, y, ...z1){
        this.foo(x, y);
        this.foo(x, y, ...z1);
    }
}
class D extends C {
    foo() {
        super.foo(1, 2);
        super.foo(1, 2, ...a);
    }
    constructor(){
        super(1, 2);
        super(1, 2, ...a);
    }
}
