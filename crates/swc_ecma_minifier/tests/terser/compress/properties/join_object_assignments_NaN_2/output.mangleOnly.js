var N = {};
N[NaN] = 1;
N[0 / 0] = 2;
console.log(N[NaN], N[NaN]);
