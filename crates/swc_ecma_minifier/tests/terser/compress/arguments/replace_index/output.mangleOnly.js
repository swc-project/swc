var arguments = [];
console.log(arguments[0]);
(function() {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
(function(a, b) {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
(function(arguments) {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
(function() {
    var arguments;
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
