// input.ts
define([
    "require",
    "exports"
], function(require, exports) {
    "use client";
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "ReactClientComponent", {
        enumerable: true,
        get: function() {
            return ReactClientComponent;
        }
    });
    function ReactClientComponent() {
        return "Hello world";
    }
});
