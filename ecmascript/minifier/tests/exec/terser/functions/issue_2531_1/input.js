function outer() {
    function inner(value) {
        function closure() {
            return value;
        }
        return function () {
            return closure();
        };
    }
    return inner("Hello");
}
console.log("Greeting:", outer()());
