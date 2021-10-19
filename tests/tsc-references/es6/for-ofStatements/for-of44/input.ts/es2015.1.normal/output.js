//@target: ES6
var array = [
    [
        0,
        ""
    ],
    [
        0,
        true
    ],
    [
        1,
        Symbol()
    ]
];
for (var [num, strBoolSym] of array){
    num;
    strBoolSym;
}
