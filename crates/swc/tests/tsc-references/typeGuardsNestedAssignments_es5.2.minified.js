import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
for(var match, Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
}, re = /./g; null != (match = re.exec("xxx"));)match[1].length, match[2].length;
