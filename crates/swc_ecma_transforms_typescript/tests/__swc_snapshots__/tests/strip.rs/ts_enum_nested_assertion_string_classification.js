var E = function(E) {
    E["template"] = `x${1}`;
    E["concatenation"] = 'x' + 1;
    E["selfRef"] = E.template;
    return E;
}(E || {});
var F = function(F) {
    F["crossRef"] = E.template;
    return F;
}(F || {});
