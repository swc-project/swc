//// [typeGuardsAsAssertions.ts]
export var none = {
    none: ''
};
export function isSome(value) {
    return 'some' in value;
}
export function fn(makeSome) {}
