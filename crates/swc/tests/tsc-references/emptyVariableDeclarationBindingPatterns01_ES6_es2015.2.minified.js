!function() {
    var a, {} = a;
    let {} = a, {} = a;
    var [] = a;
    let [] = a, [] = a;
    var {} = a, [] = a;
    let {} = a, [] = a, {} = a, [] = a;
    var {} = a;
    let {} = a, {} = a;
}(), function() {
    let ns = [];
    for (var {} of ns);
    for (let {} of ns);
    for (let {} of ns);
    for (var [] of ns);
    for (let [] of ns);
    for (let [] of ns);
}();
