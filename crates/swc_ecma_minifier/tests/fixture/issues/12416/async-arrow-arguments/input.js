// Moving the arrow must not capture the returned function's arguments.
function outer() {
    const f = async () => arguments[0];
    return function () {
        return f();
    };
}
outer("PASS")("FAIL").then(console.log, error => console.log(error.name));
