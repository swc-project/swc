let getter_effect = 'FAIL';
let setter_effect = 'FAIL';
let proto = {
    get foo () {
        getter_effect = 'PASS';
    },
    set bar (value){
        setter_effect = 'PASS';
    }
};
({
    __proto__: proto
}).foo;
({
    __proto__: proto
}).bar = 0;
assert.strictEqual(getter_effect, 'PASS');
assert.strictEqual(setter_effect, 'PASS');
