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
export const Nothing1 = strategy("Nothing", function*(state) {
    return state;
});
export const Nothing2 = strategy("Nothing", function*(state) {
    yield state;
});
export const Nothing3 = strategy("Nothing", function*(state) {
    yield;
    return state;
});
