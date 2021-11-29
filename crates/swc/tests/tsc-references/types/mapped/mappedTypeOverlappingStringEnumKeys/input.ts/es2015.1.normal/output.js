let // #37859
TerrestrialAnimalTypes;
(function(TerrestrialAnimalTypes) {
    TerrestrialAnimalTypes["CAT"] = "cat";
    TerrestrialAnimalTypes["DOG"] = "dog";
})(TerrestrialAnimalTypes || (TerrestrialAnimalTypes = {
}));
let AlienAnimalTypes;
(function(AlienAnimalTypes) {
    AlienAnimalTypes["CAT"] = "cat";
})(AlienAnimalTypes || (AlienAnimalTypes = {
}));
const catMap = {
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
