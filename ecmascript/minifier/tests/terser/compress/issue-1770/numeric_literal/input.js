var obj = {
    0: 0,
    "-0": 1,
    42: 2,
    42: 3,
    37: 4,
    o: 5,
    1e42: 6,
    j: 7,
    1e42: 8,
};

console.log(obj[-0], obj[-""], obj["-0"]);

console.log(obj[42], obj["42"]);

console.log(obj[37], obj["o"], obj[37], obj["37"]);

console.log(obj[1e42], obj["j"], obj["1e+42"]);
