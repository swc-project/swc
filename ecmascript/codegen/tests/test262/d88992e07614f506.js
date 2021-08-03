(function() {
    var a = 1;
    with (b){
        a + (c(), d(), e()); // do not transform
    }
}());
