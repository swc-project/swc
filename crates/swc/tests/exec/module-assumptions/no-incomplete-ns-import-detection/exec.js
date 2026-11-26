if (typeof exports !== "undefined") {
    expect(Object.keys(module.exports).sort()).toEqual(["hoisted", "hoistedVar"]);
    expect(module.exports.hoisted()).toBe(1);
}

export function hoisted() {
    return 1;
}
export var hoistedVar = 2;
export let value = 3;
export class Type {}
export { value as alias };

if (typeof exports !== "undefined") {
    expect(module.exports.hoistedVar).toBe(2);
    expect(module.exports.value).toBe(3);
    expect(module.exports.Type).toBe(Type);
    value = 4;
    expect(module.exports.value).toBe(4);
    expect(module.exports.alias).toBe(4);
}
