//// [stringLiteralTypesAsTags01.ts]
function hasKind(entity, kind) {
    return entity.kind === kind;
}
var x = {
    kind: "A",
    a: 100
};
if (hasKind(x, "A")) var a = x;
else var b = x;
if (hasKind(x, "B")) var d = x;
else var c = x;
