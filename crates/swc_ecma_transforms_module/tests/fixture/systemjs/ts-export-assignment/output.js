System.register([], function(_export, _context) {
    "use strict";
    function createExports() {
        return {
            value: 1
        };
    }
    return {
        setters: [],
        execute: function() {
            console.log("Hello, World!");
            _export(createExports());
        }
    };
});
