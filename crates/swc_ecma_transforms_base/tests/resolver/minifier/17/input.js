function applyVirtualResolutionMutations() {
    let WarningType;

    (function (WarningType) {
        WarningType[(WarningType["NotProvided"] = 0)] = "NotProvided";
        WarningType[(WarningType["NotCompatible"] = 1)] = "NotCompatible";
    })(WarningType || (WarningType = {}));

    console.log(WarningType.NotCompatible);
}

console.log(applyVirtualResolutionMutations);
console.log(applyVirtualResolutionMutations);
console.log(eval);
