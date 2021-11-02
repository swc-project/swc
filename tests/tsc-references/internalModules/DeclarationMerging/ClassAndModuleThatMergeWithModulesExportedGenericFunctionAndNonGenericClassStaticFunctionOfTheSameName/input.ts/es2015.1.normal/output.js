class clodule1 {
    static fn(id) {
    }
}
(function(clodule) {
    function fn(x, y) {
        return x;
    }
    clodule.fn = fn;
})(clodule1 || (clodule1 = {
}));
