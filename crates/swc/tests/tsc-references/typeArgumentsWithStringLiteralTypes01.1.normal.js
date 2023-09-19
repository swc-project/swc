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
    // The following should all come back as strings.
    // They should be assignable to/from something of a type 'string'.
    // They should not be assignable to either "Hello" or "World".
    n1.a = fun1("Hello", "World");
    n1.b = fun1("Hello", "Hello");
    n1.c = fun2("Hello", "World");
    n1.d = fun2("Hello", "Hello");
    n1.e = fun3("Hello", "Hello", "World", "Foo");
    // Should be valid
    a = takeReturnString(n1.a);
    b = takeReturnString(n1.b);
    c = takeReturnString(n1.c);
    d = takeReturnString(n1.d);
    e = takeReturnString(n1.e);
    // Passing these as arguments should cause an error.
    a = takeReturnHello(n1.a);
    b = takeReturnHello(n1.b);
    c = takeReturnHello(n1.c);
    d = takeReturnHello(n1.d);
    e = takeReturnHello(n1.e);
    // Passing these as arguments should cause an error.
    a = takeReturnHelloWorld(n1.a);
    b = takeReturnHelloWorld(n1.b);
    c = takeReturnHelloWorld(n1.c);
    d = takeReturnHelloWorld(n1.d);
    e = takeReturnHelloWorld(n1.e);
})(n1 || (n1 = {}));
var n2;
(function(n2) {
    // The following (regardless of errors) should come back typed
    // as "Hello" (or "Hello" | "Hello").
    n2.a = fun1("Hello", "Hello");
    n2.b = fun1("Hello", "World");
    n2.c = fun2("Hello", "Hello");
    n2.d = fun2("Hello", "World");
    n2.e = fun3("Hello", "World");
    // Assignment from the returned value should cause an error.
    a = takeReturnString(n2.a);
    b = takeReturnString(n2.b);
    c = takeReturnString(n2.c);
    d = takeReturnString(n2.d);
    e = takeReturnString(n2.e);
    // Should be valid
    a = takeReturnHello(n2.a);
    b = takeReturnHello(n2.b);
    c = takeReturnHello(n2.c);
    d = takeReturnHello(n2.d);
    e = takeReturnHello(n2.e);
    // Assignment from the returned value should cause an error.
    a = takeReturnHelloWorld(n2.a);
    b = takeReturnHelloWorld(n2.b);
    c = takeReturnHelloWorld(n2.c);
    d = takeReturnHelloWorld(n2.d);
    e = takeReturnHelloWorld(n2.e);
})(n2 || (n2 = {}));
var n3;
(function(n3) {
    // The following (regardless of errors) should come back typed
    // as "Hello" | "World" (or "World" | "Hello").
    n3.a = fun2("Hello", "World");
    n3.b = fun2("World", "Hello");
    n3.c = fun2("Hello", "Hello");
    n3.d = fun2("World", "World");
    n3.e = fun3("Hello", "World");
    // Assignment from the returned value should cause an error.
    a = takeReturnString(n3.a);
    b = takeReturnString(n3.b);
    c = takeReturnString(n3.c);
    d = takeReturnString(n3.d);
    e = takeReturnString(n3.e);
    // Passing these as arguments should cause an error.
    a = takeReturnHello(n3.a);
    b = takeReturnHello(n3.b);
    c = takeReturnHello(n3.c);
    d = takeReturnHello(n3.d);
    e = takeReturnHello(n3.e);
    // Both should be valid.
    a = takeReturnHelloWorld(n3.a);
    b = takeReturnHelloWorld(n3.b);
    c = takeReturnHelloWorld(n3.c);
    d = takeReturnHelloWorld(n3.d);
    e = takeReturnHelloWorld(n3.e);
})(n3 || (n3 = {}));
