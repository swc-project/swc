class A {
    foo() {
        return 1;
    }
}
class B extends A {
    bar() {
        super.foo();
    }
    baz() {
        return this.foo;
    }
}
class C extends B {
    foo() {
        return 2;
    }
    qux() {
        return super.foo() || super.foo;
    }
    norf() {
        return super.bar();
    }
}
class AA {
    foo() {
        return 1;
    }
    bar() {
        return this.foo();
    }
}
class BB extends AA {
}
