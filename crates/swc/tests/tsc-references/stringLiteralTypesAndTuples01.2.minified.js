//// [stringLiteralTypesAndTuples01.ts]
// Should all be strings.
!function(dino) {
    if ("t-rex" !== dino && "raptor" !== dino) throw "Unexpected " + dino;
}("t-rex");
