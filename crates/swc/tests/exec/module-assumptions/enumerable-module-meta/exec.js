export const value = 1;

if (typeof exports !== "undefined") {
    expect(Object.keys(module.exports).sort()).toEqual(["__esModule", "value"]);
    expect(module.exports.__esModule).toBe(true);
}
