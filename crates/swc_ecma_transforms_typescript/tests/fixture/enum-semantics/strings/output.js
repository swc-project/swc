function runtime() {
    return "value";
}
const text = `prefix:${runtime()}`;
const wrapped = `prefix:${runtime()}`;
var E = function(E) {
    E["Template"] = `prefix:${runtime()}`;
    E["Addition"] = "prefix:" + runtime();
    E["Constant"] = "prefix:3";
    E["ThroughConst"] = text;
    E[E["Asserted"] = `prefix:${runtime()}`] = "Asserted";
    E[E["Satisfies"] = "value"] = "Satisfies";
    E[E["NonNull"] = "value"] = "NonNull";
    E[E["ThroughWrapped"] = wrapped] = "ThroughWrapped";
    return E;
}(E || {});
const result = [
    E.Template,
    E.Addition,
    "prefix:3",
    E.ThroughConst,
    E.Asserted
];
