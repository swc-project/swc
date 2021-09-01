const foo = "foo";
function foobar() {
    for (let item of [
        1,
        2,
        3
    ]){
        let foo1 = "bar";
        [bar, foo1] = [
            1,
            2
        ];
    }
}
