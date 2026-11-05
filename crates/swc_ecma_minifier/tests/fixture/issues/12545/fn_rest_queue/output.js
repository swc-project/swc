const next = function(...items) {
    return ()=>items.shift();
}(1, 2, 3);
console.log(next(), next());
