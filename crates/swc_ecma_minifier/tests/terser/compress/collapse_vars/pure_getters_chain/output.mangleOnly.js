function n(n, r) {
    var o = n[1], t = n[2], u = n[3], _ = n[5];
    return o <= 23 && t <= 59 && u <= 59 && (!r || _);
}
console.log(n([
    ,
    23,
    59,
    59,
    ,
    42
], 1));
