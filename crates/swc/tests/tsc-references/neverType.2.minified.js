//// [neverType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function error(message) {
    throw Error(message);
}
(function(cb) {
    cb();
})(function() {
    return "hello";
}), function(cb) {
    cb();
}(function() {
    return error("Something failed");
}), function(cb) {
    cb();
}(function() {
    throw Error();
}), error("Error callback");
