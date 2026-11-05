function noop(value) {}
function run(x) {
    return {
        ...x
    }, 42;
}
console.log(run({
    get value () {
        return console.log("get"), 1;
    }
}));
