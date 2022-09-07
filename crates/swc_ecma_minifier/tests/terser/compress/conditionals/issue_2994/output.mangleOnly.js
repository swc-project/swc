function e(e, o, l) {
    if (e) {
        if (o) {
            return n;
        } else {
            const r = "something";
            if (l) {
                const s = "else";
                return t;
            } else {
                return undefined;
            }
        }
    }
}
let n = 2, t = 3;
for(let o = 0; o < 8; ++o){
    console.log(e(o & 4, o & 2, o & 1));
}
