define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
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
    function _default({ name , input: inp  }) {
        inp = inp || input(name);
        return {
            input: inp
        };
    }
});
