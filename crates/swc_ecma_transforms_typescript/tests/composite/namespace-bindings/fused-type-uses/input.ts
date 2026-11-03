namespace Models {
    export class Value {
        value = 1;
    }
}

import Erased = Models.Value;
import Live = Models.Value;

type AliasUse = Erased;
interface TypeUse {
    value: Erased;
}

function scoped<Value>(Value: number) {
    type Snapshot = typeof Value;
    return Value;
}

export const result = new Live().value + scoped(4);
