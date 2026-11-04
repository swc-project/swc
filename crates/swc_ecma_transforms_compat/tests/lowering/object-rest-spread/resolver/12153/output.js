const values = [
    {
        a: 1,
        extra: 2
    }
];
for (var _ref of values){
    var { a } = _ref, b = _object_without_properties(_ref, [
        "a"
    ]);
}
for (let _ref of values){
    let { a } = _ref, b = _object_without_properties(_ref, [
        "a"
    ]);
}
for (const _ref of values){
    const { a } = _ref, b = _object_without_properties(_ref, [
        "a"
    ]);
}
