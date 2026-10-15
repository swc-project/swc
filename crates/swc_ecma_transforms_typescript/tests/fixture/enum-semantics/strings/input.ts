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
