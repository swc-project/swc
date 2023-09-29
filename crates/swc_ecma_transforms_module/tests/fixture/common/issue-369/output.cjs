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
    default: function() {
        return _default;
    },
    input: function() {
        return input;
    }
});
function input(name) {
    return `${name}.md?render`;
}
function _default({ name, input: inp }) {
    inp = inp || input(name);
    return {
        input: inp
    };
}
