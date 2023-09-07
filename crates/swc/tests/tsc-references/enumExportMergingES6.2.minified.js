//// [enumExportMergingES6.ts]
var Animals, Animals1, Animals2;
var Animals3;
export { Animals3 as Animals };
(Animals = Animals3 || (Animals3 = {}))[Animals.Cat = 1] = "Cat", (Animals1 = Animals3 || (Animals3 = {}))[Animals1.Dog = 2] = "Dog", (Animals2 = Animals3 || (Animals3 = {}))[Animals2.CatDog = 3] = "CatDog";
