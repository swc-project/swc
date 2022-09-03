var value;
console.log("Greeting:", (value = "Hello", function() {
    return value;
})());
