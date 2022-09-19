//// [assignmentCompatWithObjectMembersOptionality2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var TargetHasOptional, SourceHasOptional, Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
TargetHasOptional || (TargetHasOptional = {}), new Base(), function(SourceHasOptional) {
    var c, a, d, e, f;
    new Base(), c = d, c = e, c = f, c = a, a = d, a = e, a = f, a = c;
}(SourceHasOptional || (SourceHasOptional = {}));
