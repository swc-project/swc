function foo() {
    class X {
        m() {
            return function() {
                class Y {
                }
                return new Y();
            }();
        }
    }
    var x1 = new X();
    return x1.m();
}
var x = foo();
