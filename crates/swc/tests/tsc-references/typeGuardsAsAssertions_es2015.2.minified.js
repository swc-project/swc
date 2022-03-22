let cond;
export const none = {
    none: ''
};
export function isSome(value) {
    return 'some' in value;
}
function someFrom(some) {
    return {
        some
    };
}
export function fn(makeSome) {
    let result = none;
    for(; cond;)result = someFrom(isSome(result) ? result.some : makeSome());
}
