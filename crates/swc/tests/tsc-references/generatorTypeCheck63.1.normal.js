//// [generatorTypeCheck63.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    strategy: ()=>strategy,
    Nothing: ()=>Nothing,
    Nothing1: ()=>Nothing1,
    Nothing2: ()=>Nothing2,
    Nothing3: ()=>Nothing3
});
function strategy(stratName, gen) {
    return function*(state) {
        for (const next of gen(state)){
            if (next) {
                next.lastStrategyApplied = stratName;
            }
            yield next;
        }
    };
}
const Nothing = strategy("Nothing", function*(state) {
    yield 1;
    return state;
});
const Nothing1 = strategy("Nothing", function*(state) {});
const Nothing2 = strategy("Nothing", function*(state) {
    return 1;
});
const Nothing3 = strategy("Nothing", function*(state) {
    yield state;
    return 1;
});
