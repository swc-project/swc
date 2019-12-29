(function() {
    var a = 1;
    with (b){
        a, 2, 3; // 'i' should remain
    }
}());
