switch(a){
    case 1:
        // optimize it
        (function() {
            b("c");
        }());
        b("d");
}
