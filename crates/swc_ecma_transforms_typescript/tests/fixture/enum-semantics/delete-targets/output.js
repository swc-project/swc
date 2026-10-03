(function(Values) {
    (function(E) {
        E[E["Dot"] = 1] = "Dot";
        E[E["Computed"] = 2] = "Computed";
        E[E["Grouped"] = 3] = "Grouped";
        E[E["Optional"] = 4] = "Optional";
    })(Values.E || (Values.E = {}));
    (function(ConstE) {
        ConstE[ConstE["A"] = 5] = "A";
    })(Values.ConstE || (Values.ConstE = {}));
})(Values || (Values = {}));
const Alias = Values.E;
delete Values.E.Dot;
delete Alias["Computed"];
delete Values.E.Grouped;
delete Values.E?.Optional;
delete Values.ConstE.A;
var DeleteOnly = /*#__PURE__*/ function(DeleteOnly) {
    DeleteOnly[DeleteOnly["A"] = 1] = "A";
    return DeleteOnly;
}(DeleteOnly || {});
delete DeleteOnly.A;
const object = {
    0: true,
    1: true
};
delete object[0];
delete object[0 + 1];
const receivers = [
    {
        value: true
    }
];
delete receivers[0].value;
const negative = -0;
var Values;
