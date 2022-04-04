class clodule {
    static fn(id) {}
}
!function(clodule1) {
    function fn(x, y) {
        return x;
    }
    clodule1.fn = fn;
}(clodule || (clodule = {}));
