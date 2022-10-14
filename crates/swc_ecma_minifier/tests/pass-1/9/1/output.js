console.log("Greeting:", (function(value) {
    function closure() {
        return value;
    }
    return function() {
        return value;
    };
})("Hello")());
