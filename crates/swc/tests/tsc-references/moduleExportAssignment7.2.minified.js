//// [mod.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports = {
    Thing: function Thing() {
        _class_call_check(this, Thing), this.x = 1;
    },
    AnotherThing: function AnotherThing() {
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
