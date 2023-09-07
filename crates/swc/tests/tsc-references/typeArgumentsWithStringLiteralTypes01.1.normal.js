//// [typeArgumentsWithStringLiteralTypes01.ts]
function fun1(x, y) {
    return randBool() ? x : y;
}
function fun2(x, y) {
    return randBool() ? x : y;
}
function fun3() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return args[+randBool()];
}
var n1;
(function(n1) {
    var a = fun1("Hello", "World");
    // The following should all come back as strings.
    // They should be assignable to/from something of a type 'string'.
    // They should not be assignable to either "Hello" or "World".
    Object.defineProperty(n1, "a", {
        enumerable: true,
        get: function get() {
            return a;
        },
        set: function set(v) {
            a = v;
        }
    });
    var b = fun1("Hello", "Hello");
    Object.defineProperty(n1, "b", {
        enumerable: true,
        get: function get() {
            return b;
        },
        set: function set(v) {
            b = v;
        }
    });
    var c = fun2("Hello", "World");
    Object.defineProperty(n1, "c", {
        enumerable: true,
        get: function get() {
            return c;
        },
        set: function set(v) {
            c = v;
        }
    });
    var d = fun2("Hello", "Hello");
    Object.defineProperty(n1, "d", {
        enumerable: true,
        get: function get() {
            return d;
        },
        set: function set(v) {
            d = v;
        }
    });
    var e = fun3("Hello", "Hello", "World", "Foo");
    Object.defineProperty(n1, "e", {
        enumerable: true,
        get: function get() {
            return e;
        },
        set: function set(v) {
            e = v;
        }
    });
    // Should be valid
    a = takeReturnString(a);
    b = takeReturnString(b);
    c = takeReturnString(c);
    d = takeReturnString(d);
    e = takeReturnString(e);
    // Passing these as arguments should cause an error.
    a = takeReturnHello(a);
    b = takeReturnHello(b);
    c = takeReturnHello(c);
    d = takeReturnHello(d);
    e = takeReturnHello(e);
    // Passing these as arguments should cause an error.
    a = takeReturnHelloWorld(a);
    b = takeReturnHelloWorld(b);
    c = takeReturnHelloWorld(c);
    d = takeReturnHelloWorld(d);
    e = takeReturnHelloWorld(e);
})(n1 || (n1 = {}));
var n2;
(function(n2) {
    var a = fun1("Hello", "Hello");
    // The following (regardless of errors) should come back typed
    // as "Hello" (or "Hello" | "Hello").
    Object.defineProperty(n2, "a", {
        enumerable: true,
        get: function get() {
            return a;
        },
        set: function set(v) {
            a = v;
        }
    });
    var b = fun1("Hello", "World");
    Object.defineProperty(n2, "b", {
        enumerable: true,
        get: function get() {
            return b;
        },
        set: function set(v) {
            b = v;
        }
    });
    var c = fun2("Hello", "Hello");
    Object.defineProperty(n2, "c", {
        enumerable: true,
        get: function get() {
            return c;
        },
        set: function set(v) {
            c = v;
        }
    });
    var d = fun2("Hello", "World");
    Object.defineProperty(n2, "d", {
        enumerable: true,
        get: function get() {
            return d;
        },
        set: function set(v) {
            d = v;
        }
    });
    var e = fun3("Hello", "World");
    Object.defineProperty(n2, "e", {
        enumerable: true,
        get: function get() {
            return e;
        },
        set: function set(v) {
            e = v;
        }
    });
    // Assignment from the returned value should cause an error.
    a = takeReturnString(a);
    b = takeReturnString(b);
    c = takeReturnString(c);
    d = takeReturnString(d);
    e = takeReturnString(e);
    // Should be valid
    a = takeReturnHello(a);
    b = takeReturnHello(b);
    c = takeReturnHello(c);
    d = takeReturnHello(d);
    e = takeReturnHello(e);
    // Assignment from the returned value should cause an error.
    a = takeReturnHelloWorld(a);
    b = takeReturnHelloWorld(b);
    c = takeReturnHelloWorld(c);
    d = takeReturnHelloWorld(d);
    e = takeReturnHelloWorld(e);
})(n2 || (n2 = {}));
var n3;
(function(n3) {
    var a = fun2("Hello", "World");
    // The following (regardless of errors) should come back typed
    // as "Hello" | "World" (or "World" | "Hello").
    Object.defineProperty(n3, "a", {
        enumerable: true,
        get: function get() {
            return a;
        },
        set: function set(v) {
            a = v;
        }
    });
    var b = fun2("World", "Hello");
    Object.defineProperty(n3, "b", {
        enumerable: true,
        get: function get() {
            return b;
        },
        set: function set(v) {
            b = v;
        }
    });
    var c = fun2("Hello", "Hello");
    Object.defineProperty(n3, "c", {
        enumerable: true,
        get: function get() {
            return c;
        },
        set: function set(v) {
            c = v;
        }
    });
    var d = fun2("World", "World");
    Object.defineProperty(n3, "d", {
        enumerable: true,
        get: function get() {
            return d;
        },
        set: function set(v) {
            d = v;
        }
    });
    var e = fun3("Hello", "World");
    Object.defineProperty(n3, "e", {
        enumerable: true,
        get: function get() {
            return e;
        },
        set: function set(v) {
            e = v;
        }
    });
    // Assignment from the returned value should cause an error.
    a = takeReturnString(a);
    b = takeReturnString(b);
    c = takeReturnString(c);
    d = takeReturnString(d);
    e = takeReturnString(e);
    // Passing these as arguments should cause an error.
    a = takeReturnHello(a);
    b = takeReturnHello(b);
    c = takeReturnHello(c);
    d = takeReturnHello(d);
    e = takeReturnHello(e);
    // Both should be valid.
    a = takeReturnHelloWorld(a);
    b = takeReturnHelloWorld(b);
    c = takeReturnHelloWorld(c);
    d = takeReturnHelloWorld(d);
    e = takeReturnHelloWorld(e);
})(n3 || (n3 = {}));
