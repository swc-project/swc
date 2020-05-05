function f2<T>(obj: { [P in keyof T]: T[P] }, k: keyof T) {
    const b = k in obj;
    let k1: keyof T;
    for (k1 in obj) {
        let x1 = obj[k1];
    }
    for (let k2 in obj) {
        let x2 = obj[k2];
    }
}
