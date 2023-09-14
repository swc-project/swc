//// [enumBasics.ts]
// Enum without initializers have first member = 0 and successive members = N + 1
var E1;
(function(E1) {
    E1[E1["A"] = 0] = "A";
    E1[E1["B"] = 1] = "B";
    E1[E1["C"] = 2] = "C";
})(E1 || (E1 = {}));
// Enum type is a subtype of Number
var x = 0;
// Enum object type is anonymous with properties of the enum type and numeric indexer
var e = E1;
var e;
var e;
// Reverse mapping of enum returns string name of property 
var s = E1[e.A];
var s;
var E2;
// Enum with only constant members
(function(E2) {
    E2[E2["A"] = 1] = "A";
    E2[E2["B"] = 2] = "B";
    E2[E2["C"] = 3] = "C";
})(E2 || (E2 = {}));
var E3;
// Enum with only computed members
(function(E3) {
    E3[E3["X"] = "foo".length] = "X";
    E3[E3["Y"] = 7] = "Y";
    E3[E3["Z"] = +"foo"] = "Z";
})(E3 || (E3 = {}));
var E4;
// Enum with constant members followed by computed members
(function(E4) {
    E4[E4["X"] = 0] = "X";
    E4[E4["Y"] = 1] = "Y";
    E4[E4["Z"] = "foo".length] = "Z";
})(E4 || (E4 = {}));
var E5;
// Enum with > 2 constant members with no initializer for first member, non zero initializer for second element
(function(E5) {
    E5[E5["A"] = 0] = "A";
    E5[E5["B"] = 3] = "B";
    E5[E5["C"] = 4] = "C"; // 4
})(E5 || (E5 = {}));
var E6;
(function(E6) {
    E6[E6["A"] = 0] = "A";
    E6[E6["B"] = 0] = "B";
    E6[E6["C"] = 1] = "C"; // 1
})(E6 || (E6 = {}));
var E7;
// Enum with computed member initializer of type 'any'
(function(E7) {
    E7[E7["A"] = "foo"["foo"]] = "A";
})(E7 || (E7 = {}));
var E8;
// Enum with computed member initializer of type number
(function(E8) {
    E8[E8["B"] = "foo"["foo"]] = "B";
})(E8 || (E8 = {}));
var E9;
//Enum with computed member intializer of same enum type
(function(E9) {
    E9[E9["A"] = 0] = "A";
    E9[E9["B"] = 0] = "B";
})(E9 || (E9 = {}));
// (refer to .js to validate)
// Enum constant members are propagated
var doNotPropagate = [
    E8.B,
    E7.A,
    E4.Z,
    E3.X,
    7,
    E3.Z
];
// Enum computed members are not propagated
var doPropagate = [
    0,
    0,
    0,
    1,
    0,
    0,
    3,
    4
];
