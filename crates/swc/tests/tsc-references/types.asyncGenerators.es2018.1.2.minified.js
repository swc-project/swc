//// [types.asyncGenerators.es2018.1.ts]
const assignability1 = async function*() {
    yield 1;
}, assignability2 = async function*() {
    yield Promise.resolve(1);
}, assignability3 = async function*() {
    yield* [
        1,
        2
    ];
}, assignability4 = async function*() {
    yield* [
        Promise.resolve(1)
    ];
}, assignability5 = async function*() {
    yield* async function*() {
        yield 1;
    }();
}, assignability6 = async function*() {
    yield 1;
}, assignability7 = async function*() {
    yield Promise.resolve(1);
}, assignability8 = async function*() {
    yield* [
        1,
        2
    ];
}, assignability9 = async function*() {
    yield* [
        Promise.resolve(1)
    ];
}, assignability10 = async function*() {
    yield* async function*() {
        yield 1;
    }();
}, assignability11 = async function*() {
    yield 1;
}, assignability12 = async function*() {
    yield Promise.resolve(1);
}, assignability13 = async function*() {
    yield* [
        1,
        2
    ];
}, assignability14 = async function*() {
    yield* [
        Promise.resolve(1)
    ];
}, assignability15 = async function*() {
    yield* async function*() {
        yield 1;
    }();
};
