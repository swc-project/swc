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
    n1.a = takeReturnString(n1.a);
    n1.b = takeReturnString(n1.b);
    n1.c = takeReturnString(n1.c);
    n1.d = takeReturnString(n1.d);
    n1.e = takeReturnString(n1.e);
    // Passing these as arguments should cause an error.
    n1.a = takeReturnHello(n1.a);
    n1.b = takeReturnHello(n1.b);
    n1.c = takeReturnHello(n1.c);
    n1.d = takeReturnHello(n1.d);
    n1.e = takeReturnHello(n1.e);
    // Passing these as arguments should cause an error.
    n1.a = takeReturnHelloWorld(n1.a);
    n1.b = takeReturnHelloWorld(n1.b);
    n1.c = takeReturnHelloWorld(n1.c);
    n1.d = takeReturnHelloWorld(n1.d);
    n1.e = takeReturnHelloWorld(n1.e);
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
    n2.a = takeReturnString(n2.a);
    n2.b = takeReturnString(n2.b);
    n2.c = takeReturnString(n2.c);
    n2.d = takeReturnString(n2.d);
    n2.e = takeReturnString(n2.e);
    // Should be valid
    n2.a = takeReturnHello(n2.a);
    n2.b = takeReturnHello(n2.b);
    n2.c = takeReturnHello(n2.c);
    n2.d = takeReturnHello(n2.d);
    n2.e = takeReturnHello(n2.e);
    // Assignment from the returned value should cause an error.
    n2.a = takeReturnHelloWorld(n2.a);
    n2.b = takeReturnHelloWorld(n2.b);
    n2.c = takeReturnHelloWorld(n2.c);
    n2.d = takeReturnHelloWorld(n2.d);
    n2.e = takeReturnHelloWorld(n2.e);
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
    n3.a = takeReturnString(n3.a);
    n3.b = takeReturnString(n3.b);
    n3.c = takeReturnString(n3.c);
    n3.d = takeReturnString(n3.d);
    n3.e = takeReturnString(n3.e);
    // Passing these as arguments should cause an error.
    n3.a = takeReturnHello(n3.a);
    n3.b = takeReturnHello(n3.b);
    n3.c = takeReturnHello(n3.c);
    n3.d = takeReturnHello(n3.d);
    n3.e = takeReturnHello(n3.e);
    // Both should be valid.
    n3.a = takeReturnHelloWorld(n3.a);
    n3.b = takeReturnHelloWorld(n3.b);
    n3.c = takeReturnHelloWorld(n3.c);
    n3.d = takeReturnHelloWorld(n3.d);
    n3.e = takeReturnHelloWorld(n3.e);
})(n3 || (n3 = {}));
