// @module: commonjs
// @target: es6
// @noImplicitAny: true
export function strategy(stratName, gen) {
    return function*(state) {
        for (const next of gen(state)){
            if (next) {
                next.lastStrategyApplied = stratName;
            }
            yield next;
        }
    };
}
export const Nothing = strategy("Nothing", function*(state) {
    yield 1;
    return state;
});
export const Nothing1 = strategy("Nothing", function*(state) {});
export const Nothing2 = strategy("Nothing", function*(state) {
    return 1;
});
export const Nothing3 = strategy("Nothing", function*(state) {
    yield state;
    return 1;
});
