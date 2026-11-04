(function hello() {
    console.log('outer stack', new Error().stack);
})();
eval("");
