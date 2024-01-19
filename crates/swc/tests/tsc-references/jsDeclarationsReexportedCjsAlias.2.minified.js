//// [lib.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports = {
    bar: function(a) {
        return a + a;
    },
    SomeClass: function() {
        function SomeClass() {
            _class_call_check(this, SomeClass);
        }
        var _proto = SomeClass.prototype;
        return _proto.a = function() {
            return 1;
        }, SomeClass;
    }()
};
//// [main.js]
var _require = require("./lib");
module.exports = {
    SomeClass: _require.SomeClass,
    Another: _require.SomeClass
};
