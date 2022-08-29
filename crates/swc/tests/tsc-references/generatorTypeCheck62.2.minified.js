//// [generatorTypeCheck62.ts]
"use strict";
function strategy(stratName, gen) {
    return function*(state) {
        for (let next of gen(state))next && (next.lastStrategyApplied = stratName), yield next;
    };
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    strategy: ()=>strategy,
    Nothing1: ()=>Nothing1,
    Nothing2: ()=>Nothing2,
    Nothing3: ()=>Nothing3
});
const Nothing1 = strategy("Nothing", function*(state) {
    return state;
}), Nothing2 = strategy("Nothing", function*(state) {
    yield state;
}), Nothing3 = strategy("Nothing", function*(state) {
    return yield, state;
});
