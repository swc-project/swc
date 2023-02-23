//// [mod.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
module.exports = {
    Thing: function Thing() {
        "use strict";
        _class_call_check(this, Thing), this.x = 1;
    },
    AnotherThing: function AnotherThing() {
        "use strict";
        _class_call_check(this, AnotherThing), this.y = 2;
    },
    foo: function() {
        return 3;
    },
    qux: function() {
        return 4;
    },
    baz: function() {
        return 5;
    },
    literal: ""
};
//// [main.js]
//// [index.ts]
