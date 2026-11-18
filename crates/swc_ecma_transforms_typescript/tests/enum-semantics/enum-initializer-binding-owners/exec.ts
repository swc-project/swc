const source = 17;
enum Root {
    A = source,
}

function parameter(source: number) {
    const enum Local {
        A = source,
        B = A + 1,
    }
    return Local;
}

const arrow = (source: number) => {
    const enum Local {
        A = source,
    }
    return Local;
};

function caught() {
    try {
        throw 31;
    } catch (source) {
        const enum Local {
            A = source,
        }
        return Local;
    }
}

expect([Root.A, parameter(23).A, parameter(23).B, arrow(29).A, caught().A]).toEqual([17, 23, 24, 29, 31]);
