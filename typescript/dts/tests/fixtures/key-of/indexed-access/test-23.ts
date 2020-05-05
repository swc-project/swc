// Repro from #12641

interface R {
    p: number;
}

function f<K extends keyof R>(p: K) {
    let a: any;
    a[p].add;  // any
}
