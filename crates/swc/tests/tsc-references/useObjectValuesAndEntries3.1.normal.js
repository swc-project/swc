//// [useObjectValuesAndEntries3.ts]
var o = {
    a: 1,
    b: 2
};
for (var x of Object.values(o)){
    let y = x;
}
var entries = Object.entries(o);
