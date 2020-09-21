function f1<K extends string, T>(obj: { [P in K]: T }, k: K) {
    const b = k in obj;
    let k1: K;
    for (k1 in obj) {
        let x1 = obj[k1];
    }
    for (let k2 in obj) {
        let x2 = obj[k2];
    }
}
