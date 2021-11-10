(function() {
    with (a){
        b = (c(), 1); // getter is not observable after f()
    }
}());
