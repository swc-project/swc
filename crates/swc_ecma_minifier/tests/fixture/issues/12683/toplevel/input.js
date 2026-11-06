function noop(callback) {}
function run() {
    return (
        noop(() => {
            throw new Error("UNUSED_CALLBACK_BODY");
        }),
        noop(() => {}),
        42
    );
}
console.log(run());
