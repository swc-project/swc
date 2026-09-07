export var E = function(E) {
    E[E["value"] = /x/] = "value";
    return E;
}({});
