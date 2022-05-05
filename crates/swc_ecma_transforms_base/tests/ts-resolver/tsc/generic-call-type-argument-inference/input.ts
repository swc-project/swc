class C<T, U> {
    constructor(public t: T, public u: U) {}

    foo(t: T, u: U) {
        return t;
    }

    foo2(t: T, u: U) {
        return u;
    }

    foo3<T>(t: T, u: U) {
        return t;
    }

    foo4<U>(t: T, u: U) {
        return t;
    }

    foo5<T, U>(t: T, u: U) {
        return t;
    }

    foo6<T, U>() {
        var x: T;
        return x;
    }

    foo7<T, U>(u: U) {
        var x: T;
        return x;
    }

    foo8<T, U>() {
        var x: T;
        return x;
    }
}
