//// [iterableArrayPattern28.ts]
function takeFirstTwoEntries(...[[k1, v1], [k2, v2]]) {}
takeFirstTwoEntries(...new Map([
    [
        "",
        0
    ],
    [
        "hello",
        true
    ]
]));
