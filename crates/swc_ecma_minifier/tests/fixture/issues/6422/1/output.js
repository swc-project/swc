let getter_effect = 'FAIL';
let setter_effect = 'FAIL';
({
    __proto__: {
        get foo () {
            getter_effect = 'PASS';
        },
        set bar (value){
            setter_effect = 'PASS';
        }
    }
}).foo;
assert.strictEqual(getter_effect, 'PASS');
assert.strictEqual(setter_effect, 'PASS');
