(function() {
    a: for(;;){
        for(;;){
            break a;
            b(); // This should be removed.
        }
    }
}());
