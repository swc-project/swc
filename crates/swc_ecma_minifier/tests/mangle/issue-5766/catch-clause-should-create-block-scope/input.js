var foo1;
try {

} catch (_) {
    let foo1 = 'could reuse same name with foo1';
    var foo2 = 'should not reuse same name with foo1';
}
