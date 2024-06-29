"module evaluation";
import 'assert';
import assert from 'assert';
let result = 0;
({
    ...{
        get prop () {
            result = 1;
        }
    },
    [assert.strictEqual(result, 1)]: null,
    [result = 2]: null,
    [assert.strictEqual(result, 2)]: null,
    ...{
        get prop () {
            result = 3;
        }
    }
});
assert.strictEqual(result, 3);
