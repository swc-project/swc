//@target: ES6
function takeFirstTwoEntries(...[[k1, v1], [k2, v2]]) {
}
takeFirstTwoEntries(...new Map([
    [
        "",
        true
    ],
    [
        "hello",
        true
    ]
]));
