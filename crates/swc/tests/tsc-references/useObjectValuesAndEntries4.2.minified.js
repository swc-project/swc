//// [useObjectValuesAndEntries4.ts]
var o = {
    a: 1,
    b: 2
};
for (var x of Object.values(o));
var entries = Object.entries(o);
