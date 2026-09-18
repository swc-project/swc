someFunction(function() {
    class Dead extends Unknown {
        m() {
            Dead.x;
        }
    }
    return 0;
});
