// The parameter contributes a value even when a type shares its resolved ID.
function read(Value: number) {
    type Value = { nested: true };
    namespace Local {
        export import Alias = Value;
        export const result = Alias;
    }
    return Local.result;
}

expect(read(7)).toBe(7);
