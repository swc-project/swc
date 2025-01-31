export class NumberRange implements Iterable<number> {
    private start: number;
    private end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    [Symbol.iterator](): Iterator<number> {
        let current = this.start;
        const end = this.end;

        return {
            next(): IteratorResult<number> {
                if (current <= end) {
                    return { value: current++, done: false };
                } else {
                    return { value: undefined, done: true };
                }
            },
        };
    }
}
