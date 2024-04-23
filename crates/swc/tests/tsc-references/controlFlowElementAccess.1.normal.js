//// [controlFlowElementAccess.ts]
var x = {
    o: false
};
if (x['o'] === false) {
    x['o'] = true;
}
var y = [
    0,
    0
];
if (y[0] === 0) {
    y[0] = -1;
}
