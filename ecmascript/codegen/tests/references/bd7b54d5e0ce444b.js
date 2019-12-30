(function() {
    // 'b'
    b: {
        if (a) break b;
        // 'a'
        c: {
            if (a) break c;
            if (a) break c;
            if (a) break c;
        }
        // 'a'
        c: {
            if (a) break c;
            if (a) break c;
            if (a) break c;
        }
    }
}());
