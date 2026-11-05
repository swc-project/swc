function noop(value) {}
function run(x) {
    return {
        ...x
    }, 42;
}
try {
    console.log(run({
        get value () {
            throw Error("get");
        }
    }));
} catch (e) {
    console.log(e.message);
}
