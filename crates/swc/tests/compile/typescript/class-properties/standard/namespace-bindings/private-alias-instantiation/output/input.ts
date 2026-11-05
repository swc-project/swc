(function(Values) {
    Values.value = 1;
})(Values || (Values = {}));
(function(TypeAliases) {})(TypeAliases || (TypeAliases = {}));
(function(ValueAliases) {})(ValueAliases || (ValueAliases = {}));
(function(Exported) {})(Exported || (Exported = {}));
(function(ExportedAliases) {
    ExportedAliases.Q = Exported;
})(ExportedAliases || (ExportedAliases = {}));
(function(NestedAliases) {})(NestedAliases || (NestedAliases = {}));
(function(NestedExported) {
    (function(Inner) {})(NestedExported.Inner || (NestedExported.Inner = {}));
})(NestedExported || (NestedExported = {}));
(function(NestedExportedAliases) {
    NestedExportedAliases.Q = NestedExported.Inner;
})(NestedExportedAliases || (NestedExportedAliases = {}));
(function(Merged) {
    Merged.value = 2;
})(Merged || (Merged = {}));
(function(MergedAliases) {
    MergedAliases.Q = Merged;
})(MergedAliases || (MergedAliases = {}));
(function(Used) {
    const A = Values;
    Used.value = A.value;
})(Used || (Used = {}));
(function(ForwardAliases) {})(ForwardAliases || (ForwardAliases = {}));
(function(Later) {
    Later.value = 3;
})(Later || (Later = {}));
const observed = [
    TypeAliases,
    ValueAliases,
    ExportedAliases,
    NestedAliases,
    NestedExportedAliases,
    MergedAliases,
    Used.value,
    ForwardAliases
];
var Values, TypeAliases, ValueAliases, Exported, ExportedAliases, NestedAliases, NestedExported, NestedExportedAliases, Merged, MergedAliases, Used, ForwardAliases, Later;
