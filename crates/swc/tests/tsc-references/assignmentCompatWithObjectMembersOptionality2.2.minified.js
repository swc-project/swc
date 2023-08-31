//// [assignmentCompatWithObjectMembersOptionality2.ts]
// M is optional and S contains no property with the same name as M
// N is optional and T contains no property with the same name as N
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var TargetHasOptional, SourceHasOptional, Base = function Base() {
    _class_call_check(this, Base);
};
TargetHasOptional || (TargetHasOptional = {}), new Base(), SourceHasOptional || (SourceHasOptional = {}), new Base();
