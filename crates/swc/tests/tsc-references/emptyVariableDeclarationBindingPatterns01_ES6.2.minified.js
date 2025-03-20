//// [emptyVariableDeclarationBindingPatterns01_ES6.ts]
!function() {
    var a, {} = a;
    let {} = a, {} = a;
    var [] = a;
    let [] = a, [] = a;
    var {} = a, [] = a;
    let {} = a, [] = a, {} = a, [] = a;
    var {} = a;
    let {} = a, {} = a;
}();
const ns = [];
for (var {} of ns);
for (let {} of ns);
for (const {} of ns);
for (var [] of ns);
for (let [] of ns);
for (const [] of ns);
