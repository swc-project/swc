function o(t, r) {
    return t[1] <= 23 && t[2] <= 59 && t[3] <= 59 && (!r || t[5]);
}
console.log(o([, 23, 59, 59, , 42], 1));
