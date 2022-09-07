function e(e, o, l) {
    if (e) {
        if (o) {
            return n;
        } else {
            const e = "something";
            if (l) {
                const e = "else";
                return t;
            } else {
                return undefined;
            }
        }
    }
}
let n = 2,
    t = 3;
for (let n = 0; n < 8; ++n) {
    console.log(e(n & 4, n & 2, n & 1));
}
