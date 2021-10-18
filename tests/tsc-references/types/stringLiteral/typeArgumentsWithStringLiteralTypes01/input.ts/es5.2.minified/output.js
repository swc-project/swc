var n1, n2, n3, n11, n21, n31;
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
(n11 = n1 || (n1 = {
})).a = fun1("Hello", "World"), n11.b = fun1("Hello", "Hello"), n11.c = fun2("Hello", "World"), n11.d = fun2("Hello", "Hello"), n11.e = fun3("Hello", "Hello", "World", "Foo"), a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e), (n21 = n2 || (n2 = {
})).a = fun1("Hello", "Hello"), n21.b = fun1("Hello", "World"), n21.c = fun2("Hello", "Hello"), n21.d = fun2("Hello", "World"), n21.e = fun3("Hello", "World"), a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e), (n31 = n3 || (n3 = {
})).a = fun2("Hello", "World"), n31.b = fun2("World", "Hello"), n31.c = fun2("Hello", "Hello"), n31.d = fun2("World", "World"), n31.e = fun3("Hello", "World"), a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e);
