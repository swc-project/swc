//// [stringLiteralTypesAsTags01.ts]
function hasKind(entity, kind) {
    return entity.kind === kind;
}
var x = {
    kind: "A",
    a: 100
};
hasKind(x, "A"), hasKind(x, "B");
