function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
// Basic type inference with generic calls, no errors expected
function foo(t) {
    return t;
}
var r = foo(''); // string
function foo2(t, u) {
    return u;
}
function foo2b(u) {
    var x;
    return x;
}
var r2 = foo2('', 1); // number
var r3 = foo2b(1); // {}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(t, u) {
        _classCallCheck(this, C);
        this.t = t;
        this.u = u;
    }
    _createClass(C, [
        {
            key: "foo",
            value: function foo(t, u) {
                return t;
            }
        },
        {
            key: "foo2",
            value: function foo2(t, u) {
                return u;
            }
        },
        {
            key: "foo3",
            value: function foo3(t, u) {
                return t;
            }
        },
        {
            key: "foo4",
            value: function foo4(t, u) {
                return t;
            }
        },
        {
            key: "foo5",
            value: function foo5(t, u) {
                return t;
            }
        },
        {
            key: "foo6",
            value: function foo6() {
                var x;
                return x;
            }
        },
        {
            key: "foo7",
            value: function foo7(u) {
                var x;
                return x;
            }
        },
        {
            key: "foo8",
            value: function foo8() {
                var x;
                return x;
            }
        }
    ]);
    return C;
}();
var c = new C('', 1);
var r4 = c.foo('', 1); // string
var r5 = c.foo2('', 1); // number
var r6 = c.foo3(true, 1); // boolean
var r7 = c.foo4('', true); // string
var r8 = c.foo5(true, 1); // boolean
var r9 = c.foo6(); // {}
var r10 = c.foo7(''); // {}
var r11 = c.foo8(); // {}
var i1;
var r4 = i1.foo('', 1); // string
var r5 = i1.foo2('', 1); // number
var r6 = i1.foo3(true, 1); // boolean
var r7 = i1.foo4('', true); // string
var r8 = i1.foo5(true, 1); // boolean
var r9 = i1.foo6(); // {}
var r10 = i1.foo7(''); // {}
var r11 = i1.foo8(); // {}
