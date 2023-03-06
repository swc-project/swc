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
let obj2 = {
    __proto__: proto
};
({
    __proto__: proto
}).foo;
obj2.bar = 0;
assert.strictEqual(getter_effect, 'PASS');
assert.strictEqual(setter_effect, 'PASS');
