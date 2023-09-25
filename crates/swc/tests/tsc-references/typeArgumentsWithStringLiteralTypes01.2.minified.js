//// [typeArgumentsWithStringLiteralTypes01.ts]
var n1, n2, n3, n11, n21, n31;
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
(n11 = n1 || (n1 = {})).a = fun1("Hello", "World"), n11.b = fun1("Hello", "Hello"), n11.c = fun2("Hello", "World"), n11.d = fun2("Hello", "Hello"), n11.e = fun3("Hello", "Hello", "World", "Foo"), // Should be valid
a = takeReturnString(n11.a), b = takeReturnString(n11.b), c = takeReturnString(n11.c), d = takeReturnString(n11.d), e = takeReturnString(n11.e), // Passing these as arguments should cause an error.
a = takeReturnHello(n11.a), b = takeReturnHello(n11.b), c = takeReturnHello(n11.c), d = takeReturnHello(n11.d), e = takeReturnHello(n11.e), // Passing these as arguments should cause an error.
a = takeReturnHelloWorld(n11.a), b = takeReturnHelloWorld(n11.b), c = takeReturnHelloWorld(n11.c), d = takeReturnHelloWorld(n11.d), e = takeReturnHelloWorld(n11.e), (n21 = n2 || (n2 = {})).a = fun1("Hello", "Hello"), n21.b = fun1("Hello", "World"), n21.c = fun2("Hello", "Hello"), n21.d = fun2("Hello", "World"), n21.e = fun3("Hello", "World"), // Assignment from the returned value should cause an error.
a = takeReturnString(n21.a), b = takeReturnString(n21.b), c = takeReturnString(n21.c), d = takeReturnString(n21.d), e = takeReturnString(n21.e), // Should be valid
a = takeReturnHello(n21.a), b = takeReturnHello(n21.b), c = takeReturnHello(n21.c), d = takeReturnHello(n21.d), e = takeReturnHello(n21.e), // Assignment from the returned value should cause an error.
a = takeReturnHelloWorld(n21.a), b = takeReturnHelloWorld(n21.b), c = takeReturnHelloWorld(n21.c), d = takeReturnHelloWorld(n21.d), e = takeReturnHelloWorld(n21.e), (n31 = n3 || (n3 = {})).a = fun2("Hello", "World"), n31.b = fun2("World", "Hello"), n31.c = fun2("Hello", "Hello"), n31.d = fun2("World", "World"), n31.e = fun3("Hello", "World"), // Assignment from the returned value should cause an error.
a = takeReturnString(n31.a), b = takeReturnString(n31.b), c = takeReturnString(n31.c), d = takeReturnString(n31.d), e = takeReturnString(n31.e), // Passing these as arguments should cause an error.
a = takeReturnHello(n31.a), b = takeReturnHello(n31.b), c = takeReturnHello(n31.c), d = takeReturnHello(n31.d), e = takeReturnHello(n31.e), // Both should be valid.
a = takeReturnHelloWorld(n31.a), b = takeReturnHelloWorld(n31.b), c = takeReturnHelloWorld(n31.c), d = takeReturnHelloWorld(n31.d), e = takeReturnHelloWorld(n31.e);
