const value = Math.random();
var E = function(E) {
    E[E["template"] = `v${value}`] = "template";
    E[E["concatenation"] = "v" + value] = "concatenation";
    E["nested"] = `n${value}`;
    return E;
}(E || {});
if (E[E.template] !== "concatenation" || E[E.nested] !== undefined) {
    throw new Error("Type assertions changed enum reverse mappings");
}
