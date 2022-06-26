class C {
    foo() {
        super.foo();
    }
}
var M1;
(function(M1) {
    let M2;
    (function(M2) {
        class C {
            foo() {
                super.foo();
            }
        }
    })(M2 = M1.M2 || (M1.M2 = {}));
})(M1 || (M1 = {}));
