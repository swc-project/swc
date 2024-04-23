while(a){
    try {} catch (b) {}
    // do not optimize it
    (function() {
        c('d');
    }());
}
