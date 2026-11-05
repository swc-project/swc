const set = new Set([1, 2]);
const map = new Map([["a", 1], ["b", 2]]);
const emptySet = new Set();
const emptyMap = new Map();

// Force the helpers to use the Map/Set fallback while native iteration still works.
globalThis.Symbol = undefined;

console.log(JSON.stringify([...set]));
console.log(JSON.stringify([...map]));
console.log(JSON.stringify([...emptySet]));
console.log(JSON.stringify([...emptyMap]));

const [first, second] = set;
const [entry] = map;
const [...setRest] = set;
const [...mapRest] = map;
const [missingSet] = emptySet;
const [missingMap] = emptyMap;
console.log(first, second, JSON.stringify(entry));
console.log(JSON.stringify(setRest), JSON.stringify(mapRest));
console.log(missingSet, missingMap);
