//// [generatorTypeCheck62.ts]
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
const Nothing1 = strategy("Nothing", function*(state) {
    return state;
});
const Nothing2 = strategy("Nothing", function*(state) {
    yield state;
});
const Nothing3 = strategy("Nothing", function*(state) {
    yield;
    return state;
});
