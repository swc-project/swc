// @target: es5
function f1() {
    (function(E) {
        E[E["A"] = 0] = "A";
        E[E["B"] = 1] = "B";
        E[E["C"] = 2] = "C";
    })(E || (E = {
    }));
    class C {
    }
    ;
    let a = [
        new C()
    ];
    a[0].x = E.B;
    return a;
}
function f2() {
    function g() {
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {
        }));
        class C {
        }
        ;
        let a = [
            new C()
        ];
        a[0].x = E.B;
        return a;
    }
    return g();
}
function f3(b) {
    if (true) {
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {
        }));
        if (b) {
            class C {
            }
            ;
            let a = [
                new C()
            ];
            a[0].x = E.B;
            return a;
        } else {
            class A {
            }
            ;
            let c = [
                new A()
            ];
            c[0].x = E.B;
            return c;
        }
    }
}
function f5() {
    var z1 = function() {
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {
        }));
        class C {
        }
        return new C();
    };
    var z2 = ()=>{
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {
        }));
        class C {
        }
        return new C();
    };
}
class A1 {
    m() {
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {
        }));
        class C {
        }
        return new C();
    }
    get p() {
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {
        }));
        class C {
        }
        return new C();
    }
    constructor(){
        var E1;
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E1 || (E1 = {
        }));
        class C {
        }
    }
}
function f6() {
    class A {
    }
    function g() {
        class B extends A {
        }
        function h() {
            class C extends B {
            }
            var x = new C();
            x.a = "a";
            x.b = "b";
            x.c = "c";
            return x;
        }
        return h();
    }
    return g();
}
