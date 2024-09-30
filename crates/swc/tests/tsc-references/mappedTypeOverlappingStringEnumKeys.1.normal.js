//// [mappedTypeOverlappingStringEnumKeys.ts]
// #37859
var TerrestrialAnimalTypes = /*#__PURE__*/ function(TerrestrialAnimalTypes) {
    TerrestrialAnimalTypes["CAT"] = "cat";
    TerrestrialAnimalTypes["DOG"] = "dog";
    return TerrestrialAnimalTypes;
}(TerrestrialAnimalTypes || {});
var AlienAnimalTypes = /*#__PURE__*/ function(AlienAnimalTypes) {
    AlienAnimalTypes["CAT"] = "cat";
    return AlienAnimalTypes;
}(AlienAnimalTypes || {});
var catMap = {
    cat: [
        {
            type: "cat",
            address: ""
        },
        {
            type: "cat",
            planet: ""
        }
    ],
    dog: []
};
