(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
    "use strict";
    import("./data.json", {
        assert: {
            type: "json"
        }
    });
    import(path, {
        assert: {
            type: "json"
        }
    });
});
