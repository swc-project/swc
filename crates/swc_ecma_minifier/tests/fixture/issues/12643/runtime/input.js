let transform;
const process = (value) =>
    transform ? transform(value) + ":UNREACHABLE_FEATURE_BRANCH" : value;
console.log(process(1));

let installed;
function install(next) {
    installed = next;
}
const run = (value) => (installed ? installed(value) : value);
console.log(run(2));
install((value) => value * 10);
console.log(run(2));

let late;
console.log(late);

function fnScoped(value) {
    var hook;
    return () => (hook ? hook(value) : value);
}
console.log(fnScoped(3)());

function loop() {
    for (let i = 0; i < 2; i++) {
        var loopVar;
        let blockVar;
        console.log(typeof loopVar, typeof blockVar);
    }
}
loop();

let counter;
console.log(counter++, counter);

let hook;
function sites(value) {
    if (hook) hook(value);
    if (!hook) console.log("no hook");
    console.log(typeof hook === "function" ? hook(value) : value);
    console.log(hook === undefined, hook != null);
    console.log(hook ?? value, hook || value, hook && hook(value));
    hook?.(value);
    console.log(hook?.name);
}
sites(4);

let sentinel;
console.log(5 === sentinel, sentinel === undefined);

// Folding `??` must keep the call indirect so `this` stays `undefined`.
const receiver = {
    method() {
        "use strict";
        return this === undefined;
    },
};
function viaNullish(target) {
    return (hook ?? target.method)();
}
console.log(viaNullish(receiver));

// The same applies to optional-chain members.
function viaOptionalNullish(target) {
    return (hook ?? target?.method)();
}
console.log(viaOptionalNullish(receiver));
function viaOptionalOr(target) {
    return (hook || target?.method)();
}
console.log(viaOptionalOr(receiver));
