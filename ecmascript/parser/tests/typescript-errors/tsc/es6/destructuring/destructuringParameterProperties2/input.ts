class C1 {
    constructor(private k: number, private [a, b, c]: [number, string, boolean]) {
        if ((b === undefined && c === undefined) || (this.b === undefined && this.c === undefined)) {
            this.a = a || k;
        }
    }

}
