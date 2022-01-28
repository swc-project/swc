function outer() {
    return (
        (value = "Hello"),
        function () {
            return value;
        }
    );
    var value;
}
console.log("Greeting:", outer()());
