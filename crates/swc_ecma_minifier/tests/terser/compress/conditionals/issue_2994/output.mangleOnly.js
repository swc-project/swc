function e(e, r, l) {
    if (e) {
        if (r) {
            return t;
        } else {
            const o = "something";
            if (l) {
                const s = "else";
                return n;
            } else {
                return undefined;
            }
        }
    }
}
let t = 2, n = 3;
for(let r = 0; r < 8; ++r){
    console.log(e(r & 4, r & 2, r & 1));
}
