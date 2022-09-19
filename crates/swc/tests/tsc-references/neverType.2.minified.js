//// [neverType.ts]
function error(message) {
    throw Error(message);
}
error("Something failed"), function() {
    throw Error();
}(), error("Error callback");
