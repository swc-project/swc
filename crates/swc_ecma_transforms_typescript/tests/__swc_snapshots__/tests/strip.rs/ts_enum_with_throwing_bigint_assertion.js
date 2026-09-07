export var Direct = function(Direct) {
    Direct[Direct["value"] = 1n / 0n] = "value";
    return Direct;
}({});
export var Sibling = function(Sibling) {
    Sibling[Sibling["zero"] = 0n] = "zero";
    Sibling[Sibling["value"] = Sibling.zero / Sibling.zero] = "value";
    return Sibling;
}({});
export var Unary = function(Unary) {
    Unary[Unary["value"] = +1n] = "value";
    return Unary;
}({});
