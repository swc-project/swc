namespace Values {
    export const value = 3;

    export function fromParameter(value: number) {
        const enum E { A = value }
        return E.A;
    }

    export const fromArrow = (value: number) => {
        const enum E { A = value }
        return E.A;
    };

    export function fromCatch() {
        try {
            throw 19;
        } catch (value) {
            const enum E { A = value }
            return E.A;
        }
    }
}

expect(Values.fromParameter(7)).toBe(7);
expect(Values.fromArrow(13)).toBe(13);
expect(Values.fromCatch()).toBe(19);
