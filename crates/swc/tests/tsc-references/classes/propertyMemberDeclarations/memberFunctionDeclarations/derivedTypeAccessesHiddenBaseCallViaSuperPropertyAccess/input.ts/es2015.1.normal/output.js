class Base {
    foo(x) {
        return null;
    }
}
class Derived extends Base {
    foo(x1) {
        return null;
    }
    bar() {
        var r = super.foo({
            a: 1
        }); // { a: number }
        var r2 = super.foo({
            a: 1,
            b: 2
        }); // { a: number }
        var r3 = this.foo({
            a: 1,
            b: 2
        }); // { a: number; b: number; }
    }
}
