function runtime() { return "value"; }
const text = `prefix:${runtime()}`;
const wrapped = (`prefix:${runtime()}` as string);
enum E {
    Template = `prefix:${runtime()}`,
    Addition = "prefix:" + runtime(),
    Constant = `prefix:${1 + 2}`,
    ThroughConst = text,
    Asserted = (`prefix:${runtime()}` as string),
    Satisfies = ("value" satisfies string),
    NonNull = "value"!,
    ThroughWrapped = wrapped
}
const result = [E.Template, E.Addition, E.Constant, E.ThroughConst, E.Asserted];

expect(result).toEqual(["prefix:value", "prefix:value", "prefix:3", "prefix:value", "prefix:value"]);
expect(Object.prototype.hasOwnProperty.call(E, "prefix:value")).toBe(true);
expect(Object.prototype.hasOwnProperty.call(E, "prefix:3")).toBe(false);
