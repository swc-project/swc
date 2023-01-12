//// [mappedTypeOverlappingStringEnumKeys.ts]
var TerrestrialAnimalTypes, AlienAnimalTypes;
!function(TerrestrialAnimalTypes) {
    TerrestrialAnimalTypes.CAT = "cat", TerrestrialAnimalTypes.DOG = "dog";
}(TerrestrialAnimalTypes || (TerrestrialAnimalTypes = {})), (AlienAnimalTypes || (AlienAnimalTypes = {})).CAT = "cat", TerrestrialAnimalTypes.CAT, AlienAnimalTypes.CAT;
