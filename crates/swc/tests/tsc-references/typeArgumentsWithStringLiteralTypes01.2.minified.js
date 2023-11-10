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
(n11 = n1 || (n1 = {})).a = fun1("Hello", "World"), n11.b = fun1("Hello", "Hello"), n11.c = fun2("Hello", "World"), n11.d = fun2("Hello", "Hello"), n11.e = fun3("Hello", "Hello", "World", "Foo"), n11.a = takeReturnString(n11.a), n11.b = takeReturnString(n11.b), n11.c = takeReturnString(n11.c), n11.d = takeReturnString(n11.d), n11.e = takeReturnString(n11.e), n11.a = takeReturnHello(n11.a), n11.b = takeReturnHello(n11.b), n11.c = takeReturnHello(n11.c), n11.d = takeReturnHello(n11.d), n11.e = takeReturnHello(n11.e), n11.a = takeReturnHelloWorld(n11.a), n11.b = takeReturnHelloWorld(n11.b), n11.c = takeReturnHelloWorld(n11.c), n11.d = takeReturnHelloWorld(n11.d), n11.e = takeReturnHelloWorld(n11.e), (n21 = n2 || (n2 = {})).a = fun1("Hello", "Hello"), n21.b = fun1("Hello", "World"), n21.c = fun2("Hello", "Hello"), n21.d = fun2("Hello", "World"), n21.e = fun3("Hello", "World"), n21.a = takeReturnString(n21.a), n21.b = takeReturnString(n21.b), n21.c = takeReturnString(n21.c), n21.d = takeReturnString(n21.d), n21.e = takeReturnString(n21.e), n21.a = takeReturnHello(n21.a), n21.b = takeReturnHello(n21.b), n21.c = takeReturnHello(n21.c), n21.d = takeReturnHello(n21.d), n21.e = takeReturnHello(n21.e), n21.a = takeReturnHelloWorld(n21.a), n21.b = takeReturnHelloWorld(n21.b), n21.c = takeReturnHelloWorld(n21.c), n21.d = takeReturnHelloWorld(n21.d), n21.e = takeReturnHelloWorld(n21.e), (n31 = n3 || (n3 = {})).a = fun2("Hello", "World"), n31.b = fun2("World", "Hello"), n31.c = fun2("Hello", "Hello"), n31.d = fun2("World", "World"), n31.e = fun3("Hello", "World"), n31.a = takeReturnString(n31.a), n31.b = takeReturnString(n31.b), n31.c = takeReturnString(n31.c), n31.d = takeReturnString(n31.d), n31.e = takeReturnString(n31.e), n31.a = takeReturnHello(n31.a), n31.b = takeReturnHello(n31.b), n31.c = takeReturnHello(n31.c), n31.d = takeReturnHello(n31.d), n31.e = takeReturnHello(n31.e), n31.a = takeReturnHelloWorld(n31.a), n31.b = takeReturnHelloWorld(n31.b), n31.c = takeReturnHelloWorld(n31.c), n31.d = takeReturnHelloWorld(n31.d), n31.e = takeReturnHelloWorld(n31.e);
