let calls1;
calls1 = 0, globalThis.read = function(value = function() {
    if (2 == ++calls1) throw Error("fallback");
    return calls1;
}()) {
    return value;
}, globalThis.calls = function() {
    return calls1;
}, console.log(calls(), read(10), read(null), calls()), console.log(read(), calls());
try {
    read(void 0);
} catch (error) {
    console.log(error.message, calls());
}
console.log(read(), calls());
