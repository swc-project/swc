const source = 10;
const intermediate = source + 2;
(function(Values) {
    Values.value = 17;
})(Values || (Values = {}));
function deferred() {
    const local = 19;
    return 19;
}
export const results = [
    5,
    12,
    13,
    17,
    deferred()
];
var Values;
