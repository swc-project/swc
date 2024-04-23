//// [stringLiteralTypesAndTuples01.ts]
!function(dino) {
    if ("t-rex" !== dino && "raptor" !== dino) throw "Unexpected " + dino;
}('t-rex');
