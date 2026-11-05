function noop(value) {}
function makeCallback() {
    return console.log("factory"), ()=>console.log("callback");
}
function run(value) {
    return noop({
        ...value
    }), noop(makeCallback()), 42;
}
function spread(value) {
    return noop(...value), 42;
}
console.log(run({
    get value () {
        console.log("get");
    }
}));
try {
    console.log(spread(null));
} catch (error) {
    console.log(error.name);
}
