var // #37859
TerrestrialAnimalTypes1;
(function(TerrestrialAnimalTypes) {
    TerrestrialAnimalTypes["CAT"] = "cat";
    TerrestrialAnimalTypes["DOG"] = "dog";
})(TerrestrialAnimalTypes1 || (TerrestrialAnimalTypes1 = {
}));
var AlienAnimalTypes1;
(function(AlienAnimalTypes) {
    AlienAnimalTypes["CAT"] = "cat";
})(AlienAnimalTypes1 || (AlienAnimalTypes1 = {
}));
var catMap = {
    cat: [
        {
            type: TerrestrialAnimalTypes1.CAT,
            address: ""
        },
        {
            type: AlienAnimalTypes1.CAT,
            planet: ""
        }
    ],
    dog: []
};
