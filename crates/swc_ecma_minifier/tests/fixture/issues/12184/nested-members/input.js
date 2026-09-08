function first(CONFIG) {
    console.log(CONFIG.a.b);
}

function second(CONFIG) {
    console.log(CONFIG.a.b);
}

const CONFIG = { a: { b: 4 } };

first({ a: { b: 2 } });
second({ a: { b: 3 } });
console.log(CONFIG.a.b);
console.log(CONFIG["a"].b);
console.log(GLOBAL.a.b);
