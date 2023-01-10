import assert from 'assert'
for (const foo in { 'foo': null, }) {
    const foo = 'foo2'
    assert.equal(foo, 'foo2')
}
