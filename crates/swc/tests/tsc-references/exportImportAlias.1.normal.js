//// [exportImportAlias.ts]
// expect no errors here
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A;
(function(A) {
    A.x = 'hello world';
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    A.Point = Point;
})(A || (A = {}));
var C;
(function(C) {
    C.a = A;
})(C || (C = {}));
var a = C.a.x;
var b = new C.a.Point(0, 0);
var c;
var c;
var X;
(function(X) {
    function Y() {
        return 42;
    }
    X.Y = Y;
    (function(Y) {
        var Point = function Point(x, y) {
            "use strict";
            _class_call_check(this, Point);
            this.x = x;
            this.y = y;
        };
        Y.Point = Point;
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
var Z;
(function(Z) {
    // 'y' should be a fundule here
    Z.y = X.Y;
})(Z || (Z = {}));
var m = Z.y();
var n = new Z.y.Point(0, 0);
var K;
(function(K) {
    var L = function L(name) {
        "use strict";
        _class_call_check(this, L);
        this.name = name;
    };
    K.L = L;
    (function(L) {
        L.y = 12;
    })(L = K.L || (K.L = {}));
})(K || (K = {}));
var M;
(function(M) {
    M.D = K.L;
})(M || (M = {}));
var o;
var o = new M.D('Hello');
var p;
var p;
