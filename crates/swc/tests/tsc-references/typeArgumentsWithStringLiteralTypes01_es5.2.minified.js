var n1, n2, n3;
function fun1(x, y) {
    return randBool() ? x : y;
}
function fun2(x, y) {
    return randBool() ? x : y;
}
function fun3() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return args[+randBool()];
}
!function(n11) {
    var a = n11.a = fun1("Hello", "World"), b = n11.b = fun1("Hello", "Hello"), c = n11.c = fun2("Hello", "World"), d = n11.d = fun2("Hello", "Hello"), e = n11.e = fun3("Hello", "Hello", "World", "Foo");
    a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e);
}(n1 || (n1 = {})), function(n21) {
    var a = n21.a = fun1("Hello", "Hello"), b = n21.b = fun1("Hello", "World"), c = n21.c = fun2("Hello", "Hello"), d = n21.d = fun2("Hello", "World"), e = n21.e = fun3("Hello", "World");
    a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e);
}(n2 || (n2 = {})), function(n31) {
    var a = n31.a = fun2("Hello", "World"), b = n31.b = fun2("World", "Hello"), c = n31.c = fun2("Hello", "Hello"), d = n31.d = fun2("World", "World"), e = n31.e = fun3("Hello", "World");
    a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e);
}(n3 || (n3 = {}));
