function outer() {
    var value;
    return function() {
        return "Hello";
    };
}
console.log("Greeting:", outer()());
