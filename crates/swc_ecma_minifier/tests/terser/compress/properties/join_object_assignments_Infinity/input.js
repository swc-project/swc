var o = {};
o[Infinity] = 1;
o[1 / 0] = 2;
o[-Infinity] = 3;
o[-1 / 0] = 4;
console.log(o[Infinity], o[1 / 0], o[-Infinity], o[-1 / 0]);
