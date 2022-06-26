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
    var a = n1.a = fun1("Hello", "World");
    var b = n1.b = fun1("Hello", "Hello");
    var c = n1.c = fun2("Hello", "World");
    var d = n1.d = fun2("Hello", "Hello");
    var e = n1.e = fun3("Hello", "Hello", "World", "Foo");
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
    var a = n2.a = fun1("Hello", "Hello");
    var b = n2.b = fun1("Hello", "World");
    var c = n2.c = fun2("Hello", "Hello");
    var d = n2.d = fun2("Hello", "World");
    var e = n2.e = fun3("Hello", "World");
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
    var a = n3.a = fun2("Hello", "World");
    var b = n3.b = fun2("World", "Hello");
    var c = n3.c = fun2("Hello", "Hello");
    var d = n3.d = fun2("World", "World");
    var e = n3.e = fun3("Hello", "World");
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
