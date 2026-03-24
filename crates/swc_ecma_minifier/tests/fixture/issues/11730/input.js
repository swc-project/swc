someFunction(function f() {
    class Dead extends Unknown {
        m() {
            Dead.x;
        }
    }

    return 0;
});
