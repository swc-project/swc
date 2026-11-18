let arrayCopy = [
    1,
    2,
    3
];
let currentIndex = 0;
let randomIndex = 1;
[arrayCopy[currentIndex], arrayCopy[randomIndex]] = [
    arrayCopy[randomIndex],
    arrayCopy[currentIndex]
];
let a = 1;
let b = 2;
[a, b] = [
    b,
    a
];
let obj = {
    x: 1,
    y: 2
};
[obj.x, obj.y] = [
    obj.y,
    obj.x
];
({ x: obj.x } = {
    x: 5
});
let arr = [
    [
        1,
        2
    ],
    [
        3,
        4
    ]
];
[arr[0][0], arr[1][1]] = [
    arr[1][1],
    arr[0][0]
];
let fn1;
let fn2;
[fn1, fn2] = [
    identity,
    identity
];
let s1 = "hello";
let s2 = "world";
[s1, s2] = [
    s2,
    s1
];
let config = {
    setting: "value"
};
[config.setting] = [
    "new value"
];
({ key: config.setting } = {
    key: "updated"
});
