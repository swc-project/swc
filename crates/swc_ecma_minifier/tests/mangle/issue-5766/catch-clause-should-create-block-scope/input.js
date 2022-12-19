var foo1;
try {

} catch (_) {
    var foo2 = 'should not reuse same name with foo1';
    let foo1 = 'could reuse same name with foo1';
}
