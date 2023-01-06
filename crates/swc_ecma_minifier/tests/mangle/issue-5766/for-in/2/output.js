import o from 'assert';
for(const f in {
    'foo': null
}){
    const f = 'foo2';
    o.equal(f, 'foo2');
}
