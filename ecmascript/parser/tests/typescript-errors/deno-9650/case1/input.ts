export class X {

    constructor() {
    }
    bad(target: number) {
        const d = 1;
        const min = 0;
        const max = 100;
        console.log("x", `duration ${d} not in range - ${min} ≥ ${d} && ${max} ≥ ${d}`),;
    }
}