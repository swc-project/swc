function test(a) {
    for(var i = 0; i < a.arguments.length; i++){
        var arg = a.arguments[i];
        console.log(function() {
            return arg;
        }());
    }
}
