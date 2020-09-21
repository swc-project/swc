// Repro from #21368

interface I {
    foo: string;
}

declare function take<T>(p: T): void;

function fn<T extends I, K extends keyof T>(o: T, k: K) {
    take<{} | null | undefined>(o[k]);
    take<any>(o[k]);
}

