import assert from 'assert'
for (var foo in { 'foo': null, }) { }
assert.equal(foo, 'foo')
