function a(a, d, e) {
    if (a) {
        if (d) {
            return b;
        } else {
            const f = "something";
            if (e) {
                const g = "else";
                return c;
            } else {
                return undefined;
            }
        }
    }
}
let b = 2, c = 3;
for(let d = 0; d < 8; ++d){
    console.log(a(d & 4, d & 2, d & 1));
}
