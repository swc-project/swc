//// [types.asyncGenerators.es2018.2.ts]
const assignability1 = async function*() {
    yield "a";
}, assignability2 = async function*() {
    yield* [
        "a",
        "b"
    ];
}, assignability3 = async function*() {
    yield* async function*() {
        yield "a";
    }();
}, assignability4 = async function*() {
    yield "a";
}, assignability5 = async function*() {
    yield* [
        "a",
        "b"
    ];
}, assignability6 = async function*() {
    yield* async function*() {
        yield "a";
    }();
}, assignability7 = async function*() {
    yield "a";
}, assignability8 = async function*() {
    yield* [
        "a",
        "b"
    ];
}, assignability9 = async function*() {
    yield* async function*() {
        yield "a";
    }();
};
