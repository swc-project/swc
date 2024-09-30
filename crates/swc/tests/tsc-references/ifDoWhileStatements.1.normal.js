//// [ifDoWhileStatements.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var C2 = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(C2, C);
    function C2() {
        _class_call_check(this, C2);
        return _call_super(this, C2, arguments);
    }
    return C2;
}(C);
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function F(x) {
    return 42;
}
function F2(x) {
    return x < 42;
}
(function(M) {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M.A = A;
    function F2(x) {
        return x.toString();
    }
    M.F2 = F2;
})(M || (M = {}));
(function(N) {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    N.A = A;
    function F2(x) {
        return x.toString();
    }
    N.F2 = F2;
})(N || (N = {}));
// literals
if (true) {}
while(true){}
do {}while (true);
if (null) {}
while(null){}
do {}while (null);
if (undefined) {}
while(undefined){}
do {}while (undefined);
if (0.0) {}
while(0.0){}
do {}while (0.0);
if ('a string') {}
while('a string'){}
do {}while ('a string');
if ('') {}
while(''){}
do {}while ('');
if (/[a-z]/) {}
while(/[a-z]/){}
do {}while (/[a-z]/);
if ([]) {}
while([]){}
do {}while ([]);
if ([
    1,
    2
]) {}
while([
    1,
    2
]){}
do {}while ([
    1,
    2
]);
if ({}) {}
while({}){}
do {}while ({});
if ({
    x: 1,
    y: 'a'
}) {}
while({
    x: 1,
    y: 'a'
}){}
do {}while ({
    x: 1,
    y: 'a'
});
if (function() {
    return 43;
}) {}
while(function() {
    return 43;
}){}
do {}while (function() {
    return 43;
});
if (new C()) {}
while(new C()){}
do {}while (new C());
if (new D()) {}
while(new D()){}
do {}while (new D());
// references
var a = true;
if (a) {}
while(a){}
do {}while (a);
var b = null;
if (b) {}
while(b){}
do {}while (b);
var c = undefined;
if (c) {}
while(c){}
do {}while (c);
var d = 0.0;
if (d) {}
while(d){}
do {}while (d);
var e = 'a string';
if (e) {}
while(e){}
do {}while (e);
var f = '';
if (f) {}
while(f){}
do {}while (f);
var g = /[a-z]/;
if (g) {}
while(g){}
do {}while (g);
var h = [];
if (h) {}
while(h){}
do {}while (h);
var i = [
    1,
    2
];
if (i) {}
while(i){}
do {}while (i);
var j = {};
if (j) {}
while(j){}
do {}while (j);
var k = {
    x: 1,
    y: 'a'
};
if (k) {}
while(k){}
do {}while (k);
function fn(x) {
    return null;
}
if (fn()) {}
while(fn()){}
do {}while (fn());
if (fn) {}
while(fn){}
do {}while (fn);
var M, N;
