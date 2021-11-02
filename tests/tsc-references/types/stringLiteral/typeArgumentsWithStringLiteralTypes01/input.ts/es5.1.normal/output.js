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
var n11;
(function(n1) {
    n1.a = fun1("Hello", "World");
    n1.b = fun1("Hello", "Hello");
    n1.c = fun2("Hello", "World");
    n1.d = fun2("Hello", "Hello");
    n1.e = fun3("Hello", "Hello", "World", "Foo");
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
})(n11 || (n11 = {
}));
var n21;
(function(n2) {
    n2.a = fun1("Hello", "Hello");
    n2.b = fun1("Hello", "World");
    n2.c = fun2("Hello", "Hello");
    n2.d = fun2("Hello", "World");
    n2.e = fun3("Hello", "World");
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
})(n21 || (n21 = {
}));
var n31;
(function(n3) {
    n3.a = fun2("Hello", "World");
    n3.b = fun2("World", "Hello");
    n3.c = fun2("Hello", "Hello");
    n3.d = fun2("World", "World");
    n3.e = fun3("Hello", "World");
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
})(n31 || (n31 = {
}));
