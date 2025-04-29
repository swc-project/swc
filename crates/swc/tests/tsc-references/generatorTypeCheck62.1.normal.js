//// [generatorTypeCheck62.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
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
