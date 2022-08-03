function e(e, r, f) {
    if (e) {
        if (r) {
            return t;
        } else {
            const l = "something";
            if (f) {
                const o = "else";
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
