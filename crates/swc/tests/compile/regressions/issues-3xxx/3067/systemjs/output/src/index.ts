System.register([
    "./inner/b/index.mjs",
    "../packages/c/src/index.mjs",
    "lodash"
], function(_export, _context) {
    "use strict";
    var displayB, displayC, merge;
    async function display() {
        const displayA = await _context.import("./inner/a/index.mjs").then((c)=>c.displayA);
        console.log(displayA());
        console.log(displayB());
        console.log(displayC());
        const foo = merge({}, {
            a: 22
        });
    }
    return {
        setters: [
            function(_b_ns) {
                displayB = _b_ns.displayB;
            },
            function(_c_ns) {
                displayC = _c_ns.displayC;
            },
            function(_lodash_ns) {
                merge = _lodash_ns.merge;
            }
        ],
        execute: function() {
            display();
        }
    };
});
