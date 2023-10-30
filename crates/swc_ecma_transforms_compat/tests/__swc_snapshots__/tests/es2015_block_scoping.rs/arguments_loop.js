function test() {
    for(var i = 0; i < arguments.length; i++){
        var arg = arguments[i];
        console.log(function() {
            return arg;
        }());
    }
}
