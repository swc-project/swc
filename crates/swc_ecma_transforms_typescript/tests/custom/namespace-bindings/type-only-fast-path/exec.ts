namespace Types {
    export interface Box { value: number; }
    export namespace Nested {
        export type Value = number;
    }
}
namespace Qualified.Inner {
    export interface Shape { value: number; }
}

function read(value: Types.Box) {
    namespace Local {
        export type Snapshot = typeof value;
    }
    return value.value;
}

expect(read({ value: 7 })).toBe(7);
expect(typeof Types).toBe("undefined");
expect(typeof Qualified).toBe("undefined");
