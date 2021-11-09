function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @Filename: foo1.ts
var foo2 = require('./foo2');
var M11;
export { M11 as M1 };
(function(M1) {
    var C1 = function C1() {
        "use strict";
        _classCallCheck(this, C1);
        this.m1 = new foo2.M1.C1();
        this.m1.y = 10; // OK
        this.m1.x = 20; // Error
    };
    M1.C1 = C1;
})(M11 || (M11 = {
}));
// @Filename: foo2.ts
var foo1 = require('./foo1');
(function(M1) {
    var C1 = function C1() {
        "use strict";
        _classCallCheck(this, C1);
        this.m1 = new foo1.M1.C1();
        this.m1.y = 10; // Error
        this.m1.x = 20; // OK
        var tmp = new M11.C1();
        tmp.y = 10; // OK
        tmp.x = 20; // Error			
    };
    M1.C1 = C1;
})(M11 || (M11 = {
}));
