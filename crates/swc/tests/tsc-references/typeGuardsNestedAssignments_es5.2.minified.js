import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
for(var match, Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
}, re = /./g; null != (match = re.exec("xxx"));)match[1].length, match[2].length;
