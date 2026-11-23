//// [emptyVariableDeclarationBindingPatterns01_ES6.ts]
!function() {
    var {} = void 0;
    let {} = void 0, {} = void 0;
    var [] = void 0;
    let [] = void 0, [] = void 0;
    var {} = void 0, [] = void 0;
    let {} = void 0, [] = void 0, {} = void 0, [] = void 0;
    var { p1: {}, p2: [] } = void 0;
    let { p1: {}, p2: [] } = void 0, { p1: {}, p2: [] } = void 0;
    var {} = {}, {} = {};
}(), function() {
    let ns = [];
    for (var {} of ns);
    for (let {} of ns);
    for (let {} of ns);
    for (var [] of ns);
    for (let [] of ns);
    for (let [] of ns);
}();
