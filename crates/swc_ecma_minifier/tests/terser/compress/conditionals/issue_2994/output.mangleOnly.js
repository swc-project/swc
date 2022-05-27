function b(a, b, e) {
    if (a) {
        if (b) {
            return c;
        } else {
            const f = "something";
            if (e) {
                const g = "else";
                return d;
            } else {
                return undefined;
            }
        }
    }
}
let c = 2, d = 3;
for(let a = 0; a < 8; ++a){
    console.log(b(a & 4, a & 2, a & 1));
}
