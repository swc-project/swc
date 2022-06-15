// @Filename: foo1.ts
const foo2 = require('./foo2');
export var M1;
(function(M1) {
    class C1 {
        constructor(){
            this.m1 = new foo2.M1.C1();
            this.m1.y = 10; // OK
            this.m1.x = 20; // Error
        }
    }
    M1.C1 = C1;
})(M1 || (M1 = {}));
// @Filename: foo2.ts
const foo1 = require('./foo1');
(function(M11) {
    class C1 {
        constructor(){
            this.m1 = new foo1.M1.C1();
            this.m1.y = 10; // Error
            this.m1.x = 20; // OK
            var tmp = new M1.C1();
            tmp.y = 10; // OK
            tmp.x = 20; // Error			
        }
    }
    M11.C1 = C1;
})(M1 || (M1 = {}));
