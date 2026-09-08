for(var callback; "break" !== function() {
    var value = callback;
    return value ? "break" : callback = function() {
        return value;
    };
}(););
console.log(callback());
