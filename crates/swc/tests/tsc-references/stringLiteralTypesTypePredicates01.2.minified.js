//// [stringLiteralTypesTypePredicates01.ts]
function kindIs(kind, is) {
    return kind === is;
}
var x = void 0;
if (kindIs(x, "A")) var a = x;
else var b = x;
if (kindIs(x, "B")) var d = x;
else var c = x;
