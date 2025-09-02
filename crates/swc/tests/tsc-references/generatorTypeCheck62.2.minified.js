//// [generatorTypeCheck62.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    get Nothing1 () {
        return Nothing1;
    },
    get Nothing2 () {
        return Nothing2;
    },
    get Nothing3 () {
        return Nothing3;
    },
    get strategy () {
        return strategy;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
function strategy(stratName, gen) {
    return function*(state) {
        for (let next of gen(state))next && (next.lastStrategyApplied = stratName), yield next;
    };
}
let Nothing1 = strategy("Nothing", function*(state) {
    return state;
}), Nothing2 = strategy("Nothing", function*(state) {
    yield state;
}), Nothing3 = strategy("Nothing", function*(state) {
    return yield, state;
});
