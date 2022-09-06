var o = { 0: 0, "-0": 1, 42: 2, 42: 3, 37: 4, o: 5, 1e42: 6, j: 7, 1e42: 8 };
console.log(o[-0], o[-""], o["-0"]);
console.log(o[42], o["42"]);
console.log(o[37], o["o"], o[37], o["37"]);
console.log(o[1e42], o["j"], o["1e+42"]);
