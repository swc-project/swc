const myTypes;
export { myTypes };
const testFnTypes;
function testFn(input) {
    return "number" == typeof input ? 2 * input : null;
}
export { testFn, testFnTypes };
