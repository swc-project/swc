var o = [1];
console.log([...(o, o)]);
console.log([...o, o]);
console.log([...(o || o)]);
console.log([...(o || o)]);
