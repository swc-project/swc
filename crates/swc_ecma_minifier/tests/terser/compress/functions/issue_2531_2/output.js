function outer() {
    var value;
    return value = "Hello", function() {
        return value;
    };
}
console.log("Greeting:", outer()());
