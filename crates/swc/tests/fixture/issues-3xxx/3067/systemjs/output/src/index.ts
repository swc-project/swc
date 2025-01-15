System.register([
    "./inner/b/index.mjs",
    "../packages/c/src/index.mjs",
    "lodash"
], function(_export, _context) {
    "use strict";
    var displayB, displayC, merge;
    async function display() {
        const displayA = await _context.import('./inner/a').then((c)=>c.displayA);
        console.log(displayA());
        console.log(displayB());
        console.log(displayC());
        const foo = merge({}, {
            a: 22
        });
    }
    return {
        setters: [
            function(_index) {
                displayB = _index.displayB;
            },
            function(_index) {
                displayC = _index.displayC;
            },
            function(_lodash) {
                merge = _lodash.merge;
            }
        ],
        execute: function() {
            display();
        }
    };
});
