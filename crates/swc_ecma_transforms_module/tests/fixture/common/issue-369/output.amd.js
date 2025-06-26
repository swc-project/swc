define([
    "require",
    "exports"
], function(require, exports) {
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
        get default () {
            return _default;
        },
        get input () {
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
});
