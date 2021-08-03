(function() {
    // 'a'
    b: {
        if (a) break b;
        (function() {
            // 'a'
            b: {
                if (a) break b;
                c("d");
            }
        }());
    }
}());
