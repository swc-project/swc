var a = {
    0: 0,
    "-0": 1,
    42: 2,
    42: 3,
    37: 4,
    o: 5,
    1e42: 6,
    j: 7,
    1e42: 8
};
console.log(a[-0], a[-""], a["-0"]);
console.log(a[42], a["42"]);
console.log(a[37], a["o"], a[37], a["37"]);
console.log(a[1e42], a["j"], a["1e+42"]);
