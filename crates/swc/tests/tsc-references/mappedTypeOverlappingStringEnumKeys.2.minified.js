//// [mappedTypeOverlappingStringEnumKeys.ts]
var TerrestrialAnimalTypes, AlienAnimalTypes;
!function(TerrestrialAnimalTypes) {
    TerrestrialAnimalTypes.CAT = "cat", TerrestrialAnimalTypes.DOG = "dog";
}(TerrestrialAnimalTypes || (TerrestrialAnimalTypes = {})), function(AlienAnimalTypes) {
    AlienAnimalTypes.CAT = "cat";
}(AlienAnimalTypes || (AlienAnimalTypes = {})), TerrestrialAnimalTypes.CAT, AlienAnimalTypes.CAT;
