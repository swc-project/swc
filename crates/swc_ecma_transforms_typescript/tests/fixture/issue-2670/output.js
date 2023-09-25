export var TEST;
(function(TEST) {
    const VAL1 = TEST.VAL1 = "value1";
    const VAL2 = TEST.VAL2 = `${VAL1}_value2`;
})(TEST || (TEST = {}));
