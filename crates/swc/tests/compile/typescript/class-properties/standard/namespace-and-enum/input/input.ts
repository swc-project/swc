export enum E {
    A = 1,
}

export enum E {
    B = 2,
}

enum E1 {
    C = 3,
}

enum E1 {
    D = 4,
}

export namespace N {
    export enum E {
        A = 1,
    }

    export enum E {
        B = 2,
    }

    enum E1 {
        C = 3,
    }

    enum E1 {
        D = 4,
    }
}

export namespace N {
    export enum E {
        c = 3,
    }

    export enum E {
        d = 4,
    }

    export namespace N1 {
        export enum E2 {
            e = 5,
        }
    }
    export namespace N1 {
        export enum E2 {
            f = 6,
        }
    }

    namespace N2 {
        enum E3 {
            g = 7,
        }
    }
}

export namespace N1 {
    export enum E2 {
        e = 5,
    }
}
export namespace N1 {
    export enum E2 {
        f = 6,
    }
}
