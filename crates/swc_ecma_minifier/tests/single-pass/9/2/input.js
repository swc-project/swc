console.log("Greeting:", (function (value) {
    return function () {
        return value;
    };
})("Hello")());
