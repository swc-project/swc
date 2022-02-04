var hello, world, helloOrWorld;
function f() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
}
function g() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
}
f(hello), f(world), f(helloOrWorld), g(hello), g(world), g(helloOrWorld);
