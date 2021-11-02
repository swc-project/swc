class clodule {
    static sfn(id) {
        return 42;
    }
}
(clodule || (clodule = {
})).fn = function(x, y) {
    return clodule.sfn("a");
};
