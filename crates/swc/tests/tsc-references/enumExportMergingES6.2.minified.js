//// [enumExportMergingES6.ts]
var Animals;
let Animals1 = ((Animals = {})[Animals.Cat = 1] = "Cat", Animals);
export { Animals1 as Animals };
Animals1[Animals1.Dog = 2] = "Dog", Animals1[Animals1.CatDog = 3] = "CatDog";
