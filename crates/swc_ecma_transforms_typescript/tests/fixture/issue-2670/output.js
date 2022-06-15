export var TEST;
(function(TEST) {
    var VAL1 = TEST.VAL1 = "value1";
    var VAL2 = TEST.VAL2 = `${VAL1}_value2`;
})(TEST || (TEST = {}));
