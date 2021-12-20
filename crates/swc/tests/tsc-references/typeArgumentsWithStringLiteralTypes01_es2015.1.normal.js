function fun1(x, y) {
    return randBool() ? x : y;
}
function fun2(x, y) {
    return randBool() ? x : y;
}
function fun3(...args) {
    return args[+randBool()];
}
var n1;
(function(n11) {
    n11.a = fun1("Hello", "World");
    n11.b = fun1("Hello", "Hello");
    n11.c = fun2("Hello", "World");
    n11.d = fun2("Hello", "Hello");
    n11.e = fun3("Hello", "Hello", "World", "Foo");
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
})(n1 || (n1 = {
}));
var n2;
(function(n21) {
    n21.a = fun1("Hello", "Hello");
    n21.b = fun1("Hello", "World");
    n21.c = fun2("Hello", "Hello");
    n21.d = fun2("Hello", "World");
    n21.e = fun3("Hello", "World");
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
})(n2 || (n2 = {
}));
var n3;
(function(n31) {
    n31.a = fun2("Hello", "World");
    n31.b = fun2("World", "Hello");
    n31.c = fun2("Hello", "Hello");
    n31.d = fun2("World", "World");
    n31.e = fun3("Hello", "World");
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
})(n3 || (n3 = {
}));
