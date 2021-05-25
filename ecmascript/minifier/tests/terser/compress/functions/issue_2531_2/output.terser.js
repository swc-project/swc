function outer() {
    return function () {
        return "Hello";
    };
}
console.log("Greeting:", outer()());
