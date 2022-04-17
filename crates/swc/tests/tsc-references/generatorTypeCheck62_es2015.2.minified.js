export function strategy(stratName, gen) {
    return function*(state) {
        for (let next of gen(state))next && (next.lastStrategyApplied = stratName), yield next;
    };
}
export const Nothing1 = strategy("Nothing", function*(state) {
    return state;
});
export const Nothing2 = strategy("Nothing", function*(state) {
    yield state;
});
export const Nothing3 = strategy("Nothing", function*(state) {
    return yield, state;
});
