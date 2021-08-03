(function() {
    var a;
    with (b){
        a;
    }
    a = a += 1; // This should be reduce
}());
