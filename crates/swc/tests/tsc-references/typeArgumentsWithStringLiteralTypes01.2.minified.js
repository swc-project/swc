//// [typeArgumentsWithStringLiteralTypes01.ts]
var n1, n2, n3;
function fun3() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return args[+randBool()];
}
!function(n1) {
    var a = n1.a = randBool() ? "Hello" : "World", b = n1.b = (randBool(), "Hello"), c = n1.c = randBool() ? "Hello" : "World", d = n1.d = (randBool(), "Hello"), e = n1.e = fun3("Hello", "Hello", "World", "Foo");
    a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e);
}(n1 || (n1 = {})), function(n2) {
    var a = n2.a = (randBool(), "Hello"), b = n2.b = randBool() ? "Hello" : "World", c = n2.c = (randBool(), "Hello"), d = n2.d = randBool() ? "Hello" : "World", e = n2.e = fun3("Hello", "World");
    a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e);
}(n2 || (n2 = {})), function(n3) {
    var a = n3.a = randBool() ? "Hello" : "World", b = n3.b = randBool() ? "World" : "Hello", c = n3.c = (randBool(), "Hello"), d = n3.d = (randBool(), "World"), e = n3.e = fun3("Hello", "World");
    a = takeReturnString(a), b = takeReturnString(b), c = takeReturnString(c), d = takeReturnString(d), e = takeReturnString(e), a = takeReturnHello(a), b = takeReturnHello(b), c = takeReturnHello(c), d = takeReturnHello(d), e = takeReturnHello(e), a = takeReturnHelloWorld(a), b = takeReturnHelloWorld(b), c = takeReturnHelloWorld(c), d = takeReturnHelloWorld(d), e = takeReturnHelloWorld(e);
}(n3 || (n3 = {}));
