var E, a;
!function(E) {
    E[E.x = 0] = "x";
}(E || (E = {})), extractIndexer({
    [a]: ""
}), extractIndexer({
    [E.x]: ""
}), extractIndexer({
    0: ""
});
