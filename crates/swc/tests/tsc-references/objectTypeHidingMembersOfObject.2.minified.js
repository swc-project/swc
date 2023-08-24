//// [objectTypeHidingMembersOfObject.ts]
// all of these valueOf calls should return the type shown in the overriding signatures here
var c, i, b;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
c.valueOf(), i.valueOf(), ({
    valueOf: function() {}
}).valueOf(), b.valueOf();
