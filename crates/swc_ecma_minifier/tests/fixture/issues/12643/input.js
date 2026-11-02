let transform;
globalThis.process = (value) =>
    transform ? transform(value) + ":UNREACHABLE_FEATURE_BRANCH" : value;

// Assigned later: must be preserved.
let installed;
export function install(next) {
    installed = next;
}
globalThis.run = (value) => (installed ? installed(value) : value);

// Function-scoped `var` that is never assigned.
globalThis.fnScoped = function (value) {
    var hook;
    return () => (hook ? hook(value) : value);
};

// Assigned through an update expression: must be preserved.
let counter;
globalThis.count = () => (counter++, counter);

// Each position below folds once the variable is known to be `undefined`.
let hook;
export function sites(value) {
    if (hook) hook(value);
    if (!hook) console.log("no hook");
    console.log(typeof hook === "function" ? hook(value) : value);
    console.log(hook === undefined, hook != null);
    console.log(hook ?? value, hook || value, hook && hook(value));
    hook?.(value);
    console.log(hook?.name);
}

// A plain read does not fold, so the variable is preserved.
let sentinel;
export function read(value) {
    return value === sentinel;
}
