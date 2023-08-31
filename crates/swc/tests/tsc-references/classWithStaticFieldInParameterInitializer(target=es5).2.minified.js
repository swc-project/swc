//// [classWithStaticFieldInParameterInitializer.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!// https://github.com/microsoft/TypeScript/issues/36295
function() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}();
