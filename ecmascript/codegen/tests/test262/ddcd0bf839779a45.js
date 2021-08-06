switch(a){
    case 1:
        // do not optimize it
        (function() {
            b('c');
        }());
}
