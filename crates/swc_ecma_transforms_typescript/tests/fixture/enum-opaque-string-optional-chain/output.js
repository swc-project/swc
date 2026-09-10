var E = /*#__PURE__*/ function(E) {
    E["A"] = `x${1}`;
    return E;
}(E || {});
var Present = function(Present) {
    Present["direct"] = E?.A;
    Present["computed"] = E?.["A"];
    return Present;
}(Present || {});
if (Present.direct !== "x1" || Present.computed !== "x1" || Present["x1"] !== undefined) {
    throw new Error("Optional chaining changed a present string member");
}
eval("E = null");
var Nullish = function(Nullish) {
    Nullish["direct"] = E?.A;
    Nullish["computed"] = E?.["A"];
    return Nullish;
}(Nullish || {});
if (Nullish.direct !== undefined || Nullish.computed !== undefined) {
    throw new Error("Optional chaining did not guard a null enum");
}
eval("E = undefined");
var Missing = function(Missing) {
    Missing["direct"] = E?.A;
    Missing["computed"] = E?.["A"];
    return Missing;
}(Missing || {});
if (Missing.direct !== undefined || Missing.computed !== undefined) {
    throw new Error("Optional chaining did not guard an undefined enum");
}
