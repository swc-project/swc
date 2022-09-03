//// [stringLiteralTypesAndTuples01.ts]
var hello = "Hello", brave = "Brave", newish = "New", world = "World", im = "I'm", a = "a", dinosaur = "t-rex";
function rawr(dino) {
    if ("t-rex" === dino) return "ROAAAAR!";
    if ("raptor" === dino) return "yip yip!";
    throw "Unexpected " + dino;
}
rawr(dinosaur);
