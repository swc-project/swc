function test() {
    for(var i = 0; i < arguments.length; i++){
        console.log(function() {
            return arguments[i];
        }());
    }
}
