//// [stringLiteralTypesAndTuples01.ts]
// Should all be strings.
var hello = "Hello", brave = "Brave", newish = "New", world = "World";
var im = 'I\'m', a = 'a', dinosaur = 't-rex';
rawr(dinosaur);
function rawr(dino) {
    if (dino === "t-rex") {
        return "ROAAAAR!";
    }
    if (dino === "raptor") {
        return "yip yip!";
    }
    throw "Unexpected " + dino;
}
