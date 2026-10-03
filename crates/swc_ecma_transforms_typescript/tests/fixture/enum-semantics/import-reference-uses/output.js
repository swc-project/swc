import { runtime } from "values";
function read(shadowed) {
    return shadowed + 7;
}
var Dynamic = function(Dynamic) {
    Dynamic[Dynamic["A"] = runtime] = "A";
    return Dynamic;
}(Dynamic || {});
export const result = runtime + read(3);
export const shorthand = {
    runtime
};
export { runtime as exported };
