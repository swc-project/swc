export var TEST;
(function(TEST1) {
    var VAL1 = TEST1.VAL1 = "value1";
    var VAL2 = TEST1.VAL2 = `${VAL1}_value2`;
})(TEST || (TEST = {}));
