// @declaration: true

class Box<P> {
    value: P;
}

type Boxified<BoxT> = {
    [BoxKey in keyof BoxT]: Box<BoxT[BoxKey]>;
}

declare function boxify<BO>(obj: BO): Boxified<BO>;

declare function unboxify<UB>(obj: Boxified<UB>): UB;

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