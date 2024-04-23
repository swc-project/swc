switch(a){
    default:
        // do not optimize it
        (function() {
            b('c');
        }());
}
