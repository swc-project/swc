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
    var x = new X();
    return x.m();
}
var x = foo();
