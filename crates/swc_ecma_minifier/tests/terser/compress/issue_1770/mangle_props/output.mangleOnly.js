var n = {
    undefined: 1,
    NaN: 2,
    Infinity: 3,
    "-Infinity": 4,
    null: 5
};
console.log(n[void 0], n[undefined], n["undefined"], n[0 / 0], n[NaN], n["NaN"], n[1 / 0], n[Infinity], n["Infinity"], n[-1 / 0], n[-Infinity], n["-Infinity"], n[null], n["null"]);
