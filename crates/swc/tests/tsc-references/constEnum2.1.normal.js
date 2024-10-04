//// [constEnum2.ts]
// An enum declaration that specifies a const modifier is a constant enum declaration.
// In a constant enum declaration, all members must have constant values and
// it is an error for a member declaration to specify an expression that isn't classified as a constant enum expression.
// Error : not a constant enum expression
var CONST = 9000 % 2;
var D = /*#__PURE__*/ function(D) {
    D[D["e"] = 199 * Math.floor(Math.random() * 1000)] = "e";
    D[D["f"] = 10 - 100 * Math.floor(Math.random() % 8)] = "f";
    D[D["g"] = CONST] = "g";
    return D;
}(D || {});
