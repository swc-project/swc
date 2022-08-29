//// [typeGuardsAsAssertions.ts]
var cond;
export var none = {
    none: ""
};
export function isSome(value) {
    return "some" in value;
}
function someFrom(some) {
    return {
        some: some
    };
}
export function fn(makeSome) {
    for(var result = none; cond;)result = someFrom(isSome(result) ? result.some : makeSome());
}
