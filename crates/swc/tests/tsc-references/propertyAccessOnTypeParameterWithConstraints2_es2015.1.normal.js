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
        var a = x['foo'](); // should be string
        return a + x.foo();
    }
    g(x) {
        var a = x['foo'](); // should be string
        return a + x.foo();
    }
}
//class C<U extends T, T extends A> {
//    f() {
//        var x: U;
//        var a = x['foo'](); // should be string
//        return a + x.foo();
//    }
//    g(x: U) {
//        var a = x['foo'](); // should be string
//        return a + x.foo();
//    }
//}
var r1 = new C().f();
var r1b = new C().g(new B());
//interface I<U extends T, T extends A> {
//    foo: U;
//}
var i;
var r2 = i.foo.foo();
var r2b = i.foo['foo']();
var a;
//var a: {
//    <U extends T, T extends A>(): U;
//    <U extends T, T extends A>(x: U): U;
//    <U extends T, T extends A>(x: U, y: T): U;
//}
var r3 = a().foo();
var r3b = a()['foo']();
// parameter supplied for type argument inference to succeed
var aB = new B();
var r3c = a(aB, aB).foo();
var r3d = a(aB, aB)['foo']();
var b = {
    foo: (x, y)=>{
        var a = x['foo'](); // should be string
        return a + x.foo();
    }
};
//var b = {
//    foo: <U extends T, T extends A>(x: U, y: T) => {
//        var a = x['foo'](); // should be string
//        return a + x.foo();
//    }
//}
var r4 = b.foo(aB, aB); // no inferences for T so constraint isn't satisfied, error
