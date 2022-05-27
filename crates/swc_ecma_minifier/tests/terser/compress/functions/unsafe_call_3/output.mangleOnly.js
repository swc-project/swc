console.log(function() {
    return arguments[0] + eval("arguments")[1];
}.call(0, 1, 2));
