var // #37859
TerrestrialAnimalTypes;
(function(TerrestrialAnimalTypes1) {
    TerrestrialAnimalTypes1["CAT"] = "cat";
    TerrestrialAnimalTypes1["DOG"] = "dog";
})(TerrestrialAnimalTypes || (TerrestrialAnimalTypes = {
}));
var AlienAnimalTypes;
(function(AlienAnimalTypes1) {
    AlienAnimalTypes1["CAT"] = "cat";
})(AlienAnimalTypes || (AlienAnimalTypes = {
}));
var catMap = {
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
