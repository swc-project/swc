import { runtime } from "values";
var Literal = /*#__PURE__*/ function(Literal) {
    Literal[Literal["A"] = 7] = "A";
    Literal[Literal["B"] = 8] = "B";
    return Literal;
}(Literal || {});
var Dynamic = function(Dynamic) {
    Dynamic[Dynamic["A"] = runtime] = "A";
    return Dynamic;
}(Dynamic || {});
function read(shadowed) {
    return shadowed + 8;
}
export const result = Dynamic.A + read(3);
export const shorthand = {
    runtime
};
export { runtime as exported };
