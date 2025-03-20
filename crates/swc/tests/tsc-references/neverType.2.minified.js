//// [neverType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function error(message) {
    throw Error(message);
}
error("Something failed"), function() {
    throw Error();
}(), error("Error callback");
