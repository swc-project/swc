import { TypeValue, RuntimeValue } from "values";

export namespace Types {
    export interface Box { value: typeof TypeValue; }
    export namespace Nested {
        export type Value = typeof TypeValue;
    }
}
namespace Qualified.Inner {
    export interface Shape { value: typeof TypeValue; }
}

export function read(value: Types.Box) {
    namespace Local {
        export type Snapshot = typeof TypeValue;
    }
    return RuntimeValue(value.value);
}
