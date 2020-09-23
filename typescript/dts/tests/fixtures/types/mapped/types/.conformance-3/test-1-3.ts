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

declare var bb: BoxifiedBacon;

let b = unboxify<Bacon>(bb);  // Explicit type parameter required
let bool = b.isPerfect;
let weight = bb.weight;