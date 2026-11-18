System.register([], function(_export, _context) {
    "use strict";
    var Top, value;
    _export("value", void 0);
    return {
        setters: [],
        execute: function() {
            if (cond) {
                async function nested() {
                    await work();
                }
                const arrow = async ()=>await work();
                class Local {
                    async method() {
                        await work();
                    }
                }
            }
            Top = class Top {
                async method() {
                    await work();
                }
            };
            _export("value", value = 1);
        }
    };
});
