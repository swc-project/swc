//// [typeGuardsAsAssertions.ts]
var cond;
export var none = {
    none: ''
};
export function isSome(value) {
    return 'some' in value;
}
export function fn(makeSome) {
    for(var result = none; cond;)result = {
        some: isSome(result) ? result.some : makeSome()
    };
}
