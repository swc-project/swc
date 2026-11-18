System.register([], function(_export, _context) {
    "use strict";
    var Derived;
    return {
        setters: [],
        execute: async function() {
            Derived = class Derived extends (await getBase()) {
                [await getName()]() {}
                async method() {
                    await work();
                }
            };
        }
    };
});
