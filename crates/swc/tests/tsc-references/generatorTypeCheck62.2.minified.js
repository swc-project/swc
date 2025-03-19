//// [generatorTypeCheck62.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    Nothing1: function() {
        return Nothing1;
    },
    Nothing2: function() {
        return Nothing2;
    },
    Nothing3: function() {
        return Nothing3;
    },
    strategy: function() {
        return strategy;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
function strategy(stratName, gen) {
    return function*(state) {
        for (let next of gen(state))next && (next.lastStrategyApplied = stratName), yield next;
    };
}
const Nothing1 = strategy("Nothing", function*(state) {
    return state;
}), Nothing2 = strategy("Nothing", function*(state) {
    yield state;
}), Nothing3 = strategy("Nothing", function*(state) {
    return yield, state;
});
