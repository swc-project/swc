var myTypes, testFnTypes;
export { myTypes };
function testFn(input) {
    return "number" == typeof input ? 2 * input : null;
}
export { testFn, testFnTypes };
