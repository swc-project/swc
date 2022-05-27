var a = {
    undefined: 1,
    NaN: 2,
    Infinity: 3,
    "-Infinity": 4,
    null: 5
};
console.log(a[void 0], a[undefined], a["undefined"], a[0 / 0], a[NaN], a["NaN"], a[1 / 0], a[Infinity], a["Infinity"], a[-1 / 0], a[-Infinity], a["-Infinity"], a[null], a["null"]);
