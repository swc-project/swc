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

const result = [Values.fromParameter(7), Values.fromArrow(13), Values.fromCatch()];
