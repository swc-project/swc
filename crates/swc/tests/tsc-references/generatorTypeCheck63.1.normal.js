//// [generatorTypeCheck63.ts]
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
    get Nothing () {
        return Nothing;
    },
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
