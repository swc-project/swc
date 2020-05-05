// Repro from #26409

const cf1 = <T extends { [P in K]: string; } & { cool: string; }, K extends keyof T>(t: T, k: K) => {
    const s: string = t[k];
    t.cool;
};

const cf2 = <T extends { [P in K | "cool"]: string; }, K extends keyof T>(t: T, k: K) => {
    const s: string = t[k];
    t.cool;
};
