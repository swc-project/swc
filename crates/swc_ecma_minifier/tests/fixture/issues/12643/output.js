let installed, counter, sentinel;
globalThis.process = (value)=>value;
export function install(next) {
    installed = next;
}
globalThis.run = (value)=>installed ? installed(value) : value, // Function-scoped `var` that is never assigned.
globalThis.fnScoped = function(value) {
    return ()=>value;
}, globalThis.count = ()=>++counter;
export function sites(value) {
    console.log("no hook"), console.log(value), console.log(!0, !1), console.log(value, value, void 0), console.log(void 0);
}
export function read(value) {
    return value === sentinel;
}
