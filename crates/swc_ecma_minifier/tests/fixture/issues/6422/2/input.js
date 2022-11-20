import assert from 'assert'
let result = 'FAIL';
const unused = {
    ...{
        get prop() {
            result = 'PASS';
        }
    }
};
assert.strictEqual(result, 'PASS');