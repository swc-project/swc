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
