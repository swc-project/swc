function o(t, r) {
    var a = t[1],
        s = t[2],
        o = t[3],
        i = t[5];
    return a <= 23 && s <= 59 && o <= 59 && (!r || i);
}
console.log(o([, 23, 59, 59, , 42], 1));
