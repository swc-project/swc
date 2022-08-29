//// [enumExportMergingES6.ts]
export var Animals;
!function(Animals) {
    Animals[Animals.Cat = 1] = "Cat";
}(Animals || (Animals = {})), function(Animals) {
    Animals[Animals.Dog = 2] = "Dog";
}(Animals || (Animals = {})), function(Animals) {
    Animals[Animals.CatDog = Cat | Dog] = "CatDog";
}(Animals || (Animals = {}));
