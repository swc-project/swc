class x87 {
    constructor(
        parm: () => Base[] = function named() {
            return [d1, d2];
        }
    ) {}
}

class x90 {
    constructor(
        parm: { (): Base[] } = function named() {
            return [d1, d2];
        }
    ) {}
}
