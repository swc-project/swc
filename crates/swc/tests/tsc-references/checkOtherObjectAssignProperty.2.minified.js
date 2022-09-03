//// [mod1.js]
var obj = {
    value: 42,
    writable: !0
};
Object.defineProperty(exports, "thing", obj);
var str = "other";
Object.defineProperty(exports, str, {
    value: 42,
    writable: !0
});
var propName = "prop";
Object.defineProperty(exports, propName, {
    value: 42,
    writable: !0
}), Object.defineProperty(exports, "bad1", {}), Object.defineProperty(exports, "bad2", {
    get: function() {
        return 12;
    },
    value: "no"
}), Object.defineProperty(exports, "bad3", {
    writable: !0
});
//// [importer.js]
var mod = require("./mod1");
mod.thing, mod.other, mod.prop, mod.bad1, mod.bad2, mod.bad3, mod.thing = 0, mod.other = 0, mod.prop = 0, mod.bad1 = 0, mod.bad2 = 0, mod.bad3 = 0;
