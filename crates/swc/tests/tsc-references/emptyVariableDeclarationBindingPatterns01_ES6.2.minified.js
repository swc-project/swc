//// [emptyVariableDeclarationBindingPatterns01_ES6.ts]
!function() {
    var a, {} = a;
    let {} = a, {} = a;
    var [] = a;
    let [] = a, [] = a;
    var {} = a, [] = a;
    let {} = a, [] = a, {} = a, [] = a;
    var { p1: {}, p2: [] } = a;
    let { p1: {}, p2: [] } = a, { p1: {}, p2: [] } = a;
    var {} = {}, {} = {};
}();
let ns = [];
for (var {} of ns);
for (let {} of ns);
for (let {} of ns);
for (var [] of ns);
for (let [] of ns);
for (let [] of ns);
