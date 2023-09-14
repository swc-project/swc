//// [mappedTypeOverlappingStringEnumKeys.ts]
// #37859
var TerrestrialAnimalTypes;
(function(TerrestrialAnimalTypes) {
    TerrestrialAnimalTypes["CAT"] = "cat";
    TerrestrialAnimalTypes["DOG"] = "dog";
})(TerrestrialAnimalTypes || (TerrestrialAnimalTypes = {}));
var AlienAnimalTypes;
(function(AlienAnimalTypes) {
    AlienAnimalTypes["CAT"] = "cat";
})(AlienAnimalTypes || (AlienAnimalTypes = {}));
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
