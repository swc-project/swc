var E;
(function(E1) {
    E1[E1["x"] = 0] = "x";
})(E || (E = {
}));
var a;
extractIndexer({
    [a]: ""
}); // Should return string
extractIndexer({
    [E.x]: ""
}); // Should return string
extractIndexer({
    ["" || 0]: ""
}); // Should return any (widened form of undefined)
