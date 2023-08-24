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
a = (n11 = n1 || (n1 = {})).a = fun1("Hello", "World"), b = n11.b = fun1("Hello", "Hello"), c = n11.c = fun2("Hello", "World"), d = n11.d = fun2("Hello", "Hello"), e = n11.e = fun3("Hello", "Hello", "World", "Foo"), // Should be valid
a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), // Passing these as arguments should cause an error.
a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), // Passing these as arguments should cause an error.
a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), takeReturnHelloWorld(e), a1 = (n21 = n2 || (n2 = {})).a = fun1("Hello", "Hello"), b1 = n21.b = fun1("Hello", "World"), c1 = n21.c = fun2("Hello", "Hello"), d1 = n21.d = fun2("Hello", "World"), e1 = n21.e = fun3("Hello", "World"), // Assignment from the returned value should cause an error.
a1 = takeReturnString(a1), b1 = takeReturnString(b1), c1 = takeReturnString(c1), d1 = takeReturnString(d1), e1 = takeReturnString(e1), // Should be valid
a1 = takeReturnHello(a1), b1 = takeReturnHello(b1), c1 = takeReturnHello(c1), d1 = takeReturnHello(d1), e1 = takeReturnHello(e1), // Assignment from the returned value should cause an error.
a1 = takeReturnHelloWorld(a1), b1 = takeReturnHelloWorld(b1), c1 = takeReturnHelloWorld(c1), d1 = takeReturnHelloWorld(d1), takeReturnHelloWorld(e1), a2 = (n31 = n3 || (n3 = {})).a = fun2("Hello", "World"), b2 = n31.b = fun2("World", "Hello"), c2 = n31.c = fun2("Hello", "Hello"), d2 = n31.d = fun2("World", "World"), e2 = n31.e = fun3("Hello", "World"), // Assignment from the returned value should cause an error.
a2 = takeReturnString(a2), b2 = takeReturnString(b2), c2 = takeReturnString(c2), d2 = takeReturnString(d2), e2 = takeReturnString(e2), // Passing these as arguments should cause an error.
a2 = takeReturnHello(a2), b2 = takeReturnHello(b2), c2 = takeReturnHello(c2), d2 = takeReturnHello(d2), e2 = takeReturnHello(e2), // Both should be valid.
a2 = takeReturnHelloWorld(a2), b2 = takeReturnHelloWorld(b2), c2 = takeReturnHelloWorld(c2), d2 = takeReturnHelloWorld(d2), takeReturnHelloWorld(e2);
