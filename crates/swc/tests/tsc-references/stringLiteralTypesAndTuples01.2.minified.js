//// [stringLiteralTypesAndTuples01.ts]
!function(dino) {
    if ("t-rex" === dino) return "ROAAAAR!";
    if ("raptor" === dino) return "yip yip!";
    throw "Unexpected " + dino;
}("t-rex");
