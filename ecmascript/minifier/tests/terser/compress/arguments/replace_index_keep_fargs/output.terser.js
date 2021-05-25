var arguments = [];
console.log(arguments[0]);
(function (argument_0, argument_1) {
    console.log(argument_1, argument_1, arguments.foo);
})("bar", 42);
(function (a, b) {
    console.log(b, b, arguments.foo);
})("bar", 42);
(function (arguments) {
    console.log(arguments[1], arguments[1], arguments.foo);
})("bar", 42);
(function () {
    var arguments;
    console.log(arguments[1], arguments[1], arguments.foo);
})("bar", 42);
