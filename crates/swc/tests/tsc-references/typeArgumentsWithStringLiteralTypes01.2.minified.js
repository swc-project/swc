//// [typeArgumentsWithStringLiteralTypes01.ts]
var n1, n2, n3, n11, a, b, c, d, e, n21, a1, b1, c1, d1, e1, n31, a2, b2, c2, d2, e2;
function fun1(x, y) {
    return randBool() ? x : y;
}
function fun2(x, y) {
    return randBool() ? x : y;
}
function fun3() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return args[+randBool()];
}
n11 = n1 || (n1 = {}), a = fun1("Hello", "World"), Object.defineProperty(n11, "a", {
    enumerable: !0,
    get: function() {
        return a;
    },
    set: function(v) {
        a = v;
    }
}), b = fun1("Hello", "Hello"), Object.defineProperty(n11, "b", {
    enumerable: !0,
    get: function() {
        return b;
    },
    set: function(v) {
        b = v;
    }
}), c = fun2("Hello", "World"), Object.defineProperty(n11, "c", {
    enumerable: !0,
    get: function() {
        return c;
    },
    set: function(v) {
        c = v;
    }
}), d = fun2("Hello", "Hello"), Object.defineProperty(n11, "d", {
    enumerable: !0,
    get: function() {
        return d;
    },
    set: function(v) {
        d = v;
    }
}), e = fun3("Hello", "Hello", "World", "Foo"), Object.defineProperty(n11, "e", {
    enumerable: !0,
    get: function() {
        return e;
    },
    set: function(v) {
        e = v;
    }
}), // Should be valid
a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), // Passing these as arguments should cause an error.
a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), // Passing these as arguments should cause an error.
a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e), n21 = n2 || (n2 = {}), a1 = fun1("Hello", "Hello"), Object.defineProperty(n21, "a", {
    enumerable: !0,
    get: function() {
        return a1;
    },
    set: function(v) {
        a1 = v;
    }
}), b1 = fun1("Hello", "World"), Object.defineProperty(n21, "b", {
    enumerable: !0,
    get: function() {
        return b1;
    },
    set: function(v) {
        b1 = v;
    }
}), c1 = fun2("Hello", "Hello"), Object.defineProperty(n21, "c", {
    enumerable: !0,
    get: function() {
        return c1;
    },
    set: function(v) {
        c1 = v;
    }
}), d1 = fun2("Hello", "World"), Object.defineProperty(n21, "d", {
    enumerable: !0,
    get: function() {
        return d1;
    },
    set: function(v) {
        d1 = v;
    }
}), e1 = fun3("Hello", "World"), Object.defineProperty(n21, "e", {
    enumerable: !0,
    get: function() {
        return e1;
    },
    set: function(v) {
        e1 = v;
    }
}), // Assignment from the returned value should cause an error.
a1 = takeReturnString(a1), b1 = takeReturnString(b1), c1 = takeReturnString(c1), d1 = takeReturnString(d1), e1 = takeReturnString(e1), // Should be valid
a1 = takeReturnHello(a1), b1 = takeReturnHello(b1), c1 = takeReturnHello(c1), d1 = takeReturnHello(d1), e1 = takeReturnHello(e1), // Assignment from the returned value should cause an error.
a1 = takeReturnHelloWorld(a1), b1 = takeReturnHelloWorld(b1), c1 = takeReturnHelloWorld(c1), d1 = takeReturnHelloWorld(d1), e1 = takeReturnHelloWorld(e1), n31 = n3 || (n3 = {}), a2 = fun2("Hello", "World"), Object.defineProperty(n31, "a", {
    enumerable: !0,
    get: function() {
        return a2;
    },
    set: function(v) {
        a2 = v;
    }
}), b2 = fun2("World", "Hello"), Object.defineProperty(n31, "b", {
    enumerable: !0,
    get: function() {
        return b2;
    },
    set: function(v) {
        b2 = v;
    }
}), c2 = fun2("Hello", "Hello"), Object.defineProperty(n31, "c", {
    enumerable: !0,
    get: function() {
        return c2;
    },
    set: function(v) {
        c2 = v;
    }
}), d2 = fun2("World", "World"), Object.defineProperty(n31, "d", {
    enumerable: !0,
    get: function() {
        return d2;
    },
    set: function(v) {
        d2 = v;
    }
}), e2 = fun3("Hello", "World"), Object.defineProperty(n31, "e", {
    enumerable: !0,
    get: function() {
        return e2;
    },
    set: function(v) {
        e2 = v;
    }
}), // Assignment from the returned value should cause an error.
a2 = takeReturnString(a2), b2 = takeReturnString(b2), c2 = takeReturnString(c2), d2 = takeReturnString(d2), e2 = takeReturnString(e2), // Passing these as arguments should cause an error.
a2 = takeReturnHello(a2), b2 = takeReturnHello(b2), c2 = takeReturnHello(c2), d2 = takeReturnHello(d2), e2 = takeReturnHello(e2), // Both should be valid.
a2 = takeReturnHelloWorld(a2), b2 = takeReturnHelloWorld(b2), c2 = takeReturnHelloWorld(c2), d2 = takeReturnHelloWorld(d2), e2 = takeReturnHelloWorld(e2);
