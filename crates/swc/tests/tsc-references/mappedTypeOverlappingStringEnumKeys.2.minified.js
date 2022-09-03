//// [mappedTypeOverlappingStringEnumKeys.ts]
!function(TerrestrialAnimalTypes) {
    TerrestrialAnimalTypes.CAT = "cat", TerrestrialAnimalTypes.DOG = "dog";
}(TerrestrialAnimalTypes || (TerrestrialAnimalTypes = {})), function(AlienAnimalTypes) {
    AlienAnimalTypes.CAT = "cat";
}(AlienAnimalTypes || (AlienAnimalTypes = {}));
var TerrestrialAnimalTypes, AlienAnimalTypes, catMap = {
    cat: [
        {
            type: TerrestrialAnimalTypes.CAT,
            address: ""
        },
        {
            type: AlienAnimalTypes.CAT,
            planet: ""
        }
    ],
    dog: []
};
