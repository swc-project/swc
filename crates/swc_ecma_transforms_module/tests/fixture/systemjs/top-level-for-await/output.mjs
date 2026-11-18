System.register([], function(_export, _context) {
    "use strict";
    return {
        setters: [],
        execute: async function() {
            for await (const item of items){
                consume(item);
            }
        }
    };
});
