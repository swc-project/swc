var n1, n2, n3;
function fun1(x, y) {
    return randBool() ? x : y;
}
function fun2(x, y) {
    return randBool() ? x : y;
}
function fun3(...args) {
    return args[+randBool()];
}
!function(n1) {
    var a = n1.a = fun1("Hello", "World"), b = n1.b = fun1("Hello", "Hello"), c = n1.c = fun2("Hello", "World"), d = n1.d = fun2("Hello", "Hello"), e = n1.e = fun3("Hello", "Hello", "World", "Foo");
    a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e);
}(n1 || (n1 = {})), function(n2) {
    var a = n2.a = fun1("Hello", "Hello"), b = n2.b = fun1("Hello", "World"), c = n2.c = fun2("Hello", "Hello"), d = n2.d = fun2("Hello", "World"), e = n2.e = fun3("Hello", "World");
    a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e);
}(n2 || (n2 = {})), function(n3) {
    var a = n3.a = fun2("Hello", "World"), b = n3.b = fun2("World", "Hello"), c = n3.c = fun2("Hello", "Hello"), d = n3.d = fun2("World", "World"), e = n3.e = fun3("Hello", "World");
    a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e);
}(n3 || (n3 = {}));
