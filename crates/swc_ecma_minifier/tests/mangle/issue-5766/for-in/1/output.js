import o from 'assert';
for(var r in {
    'foo': null
}){}
o.equal(r, 'foo');
