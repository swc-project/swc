// @declaration: true

class Box<P> {
    value: P;
}

type Boxified<T> = {
    [K in keyof T]: Box<T[K]>;
}

declare function boxify<T>(obj: T): Boxified<T>;

declare function unboxify<T>(obj: Boxified<T>): T;

interface Bacon {
    isPerfect: boolean;
    weight: number;
}

interface BoxifiedBacon {
    isPerfect: Box<boolean>;
    weight: Box<number>;
}

declare var bb: Boxified<Bacon>;
let b = unboxify(bb);  // Infer Bacon for T
let bool = b.isPerfect;
let weight = b.weight;
