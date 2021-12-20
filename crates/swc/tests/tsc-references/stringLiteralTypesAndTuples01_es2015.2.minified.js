let [hello, brave, newish, world] = [
    "Hello",
    "Brave",
    "New",
    "World"
], [im, a, dinosaur] = [
    "I'm",
    "a",
    "t-rex"
];
!function(dino) {
    if ("t-rex" === dino) return "ROAAAAR!";
    if ("raptor" === dino) return "yip yip!";
    throw "Unexpected " + dino;
}(dinosaur);
