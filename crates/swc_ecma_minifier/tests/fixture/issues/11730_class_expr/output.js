someFunction(function() {
    return class Dead extends Unknown {
        m() {
            Dead.x;
        }
    }, 0;
});
