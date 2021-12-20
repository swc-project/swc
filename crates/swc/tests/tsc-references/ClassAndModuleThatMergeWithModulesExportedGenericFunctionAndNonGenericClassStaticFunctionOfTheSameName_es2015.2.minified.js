class clodule {
    static fn(id) {
    }
}
(clodule || (clodule = {
})).fn = function(x, y) {
    return x;
};
