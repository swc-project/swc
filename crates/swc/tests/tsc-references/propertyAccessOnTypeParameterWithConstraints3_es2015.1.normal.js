// generic types should behave as if they have properties of their constraint type
class A {
    foo() {
        return '';
    }
}
class B extends A {
    bar() {
        return '';
    }
}
class C {
    f() {
        var x;
        // BUG 823818
        var a = x['foo'](); // should be string
        return a + x.foo();
    }
    g(x) {
        // BUG 823818
        var a = x['foo'](); // should be string
        return a + x.foo();
    }
}
var r1a = new C().f();
var r1b = new C().g(new B());
var i;
var r2 = i.foo.foo();
var r2b = i.foo['foo']();
var a;
var r3 = a().foo(); // error, no inferences for U so it doesn't satisfy constraint
var r3b = a()['foo']();
// parameter supplied for type argument inference for U
var r3c = a(new B()).foo(); // valid call to an invalid function, U is inferred as B, which has a foo
var r3d = a(new B())['foo'](); // valid call to an invalid function, U is inferred as B, which has a foo
var b = {
    foo: (x)=>{
        // BUG 823818
        var a = x['foo'](); // should be string
        return a + x.foo();
    }
};
var r4 = b.foo(new B()); // valid call to an invalid function
