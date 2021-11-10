var E1;
(function(E) {
    E[E["x"] = 0] = "x";
})(E1 || (E1 = {
}));
var a;
extractIndexer({
    [a]: ""
}); // Should return string
extractIndexer({
    [E1.x]: ""
}); // Should return string
extractIndexer({
    ["" || 0]: ""
}); // Should return any (widened form of undefined)
