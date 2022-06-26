class clodule {
    static fn(id) {}
}
!function(clodule) {
    function fn(x, y) {
        return x;
    }
    clodule.fn = fn;
}(clodule || (clodule = {}));
