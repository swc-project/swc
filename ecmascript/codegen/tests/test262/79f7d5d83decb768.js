(function() {
    a: for(;;){
        for(;;){
            continue a;
            b(); // This should be removed.
        }
    }
}());
