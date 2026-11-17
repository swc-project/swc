import assert from 'assert';
let result = 0;
({
    ...{
        get prop () {
            result = 1;
        }
    },
    0: assert.strictEqual(result, 1),
    0: result = 2,
    0: assert.strictEqual(result, 2),
    ...{
        get prop () {
            result = 3;
        }
    }
});
assert.strictEqual(result, 3);
