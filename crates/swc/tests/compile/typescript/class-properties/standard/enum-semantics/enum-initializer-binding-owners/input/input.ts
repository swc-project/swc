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

export const result = [Root.A, parameter(23), arrow(29), caught()];
