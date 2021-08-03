(function() {
    var a = 1;
    with (b){
        a += a += 2; // 'i' lookup can be observed by obj's getter.
    }
}());
