//// [jsObjectsMarkedAsOpenEnded.ts]
//// [a.js]
import "@swc/helpers/src/_class_call_check.mjs";
//// [b.ts]
variable.a = 1, new C().member.a = 1, new C().initializedMember.a = 1, obj.property.a = 1, arr[0].a = 1, getObj().a = 1;
