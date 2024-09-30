//// [enumExportMergingES6.ts]
export let Animals = /*#__PURE__*/ function(Animals) {
    Animals[Animals["Cat"] = 1] = "Cat";
    return Animals;
}({});
(function(Animals) {
    Animals[Animals["Dog"] = 2] = "Dog";
})(Animals);
(function(Animals) {
    Animals[Animals["CatDog"] = 3] = "CatDog";
})(Animals);
