import assert from 'assert';
let result = 'FAIL';
({
    ...{
        get prop () {
            result = 'PASS';
        }
    }
});
assert.strictEqual(result, 'PASS');
