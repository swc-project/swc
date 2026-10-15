const enum AmbientValue { One = 1 }
namespace AmbientExport {
    export declare const value = AmbientValue.One;
    export declare const literal = 2;
}
namespace RuntimeExport {
    export const value = AmbientValue.One;
}

expect(AmbientExport).toEqual({});
expect(RuntimeExport.value).toBe(1);
