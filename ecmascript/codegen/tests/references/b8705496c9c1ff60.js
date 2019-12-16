(function() {
    var a = {
    };
    with (a){
        (1, b)(); // Don't transform it to test()

    }
}());
