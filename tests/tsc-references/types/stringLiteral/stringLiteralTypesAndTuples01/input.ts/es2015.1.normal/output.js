// @declaration: true
// Should all be strings.
let [hello, brave, newish, world] = [
    "Hello",
    "Brave",
    "New",
    "World"
];
let [im, a, dinosaur] = [
    'I\'m',
    'a',
    't-rex'
];
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
