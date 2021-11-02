class A {
}
class B extends A {
}
class C extends A {
} // error -- inherits abstract methods
class D extends A {
} // error -- inherits abstract methods
class E extends A {
    foo() {
        return this.t;
    }
}
class F extends A {
    bar(t) {
    }
}
class G extends A {
    foo() {
        return this.t;
    }
    bar(t1) {
    }
}
