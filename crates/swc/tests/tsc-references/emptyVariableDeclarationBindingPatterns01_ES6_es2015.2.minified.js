!function() {
    var a, {} = a;
    let {} = a;
    const {} = a;
    var [] = a;
    let [] = a;
    const [] = a;
    var {} = a, [] = a;
    let {} = a, [] = a;
    const {} = a, [] = a;
    var { p1: {} , p2: []  } = a;
    let { p1: {} , p2: []  } = a;
    const { p1: {} , p2: []  } = a;
    var {} = {
    }, {} = {
    };
}(), (function() {
    const ns = [];
    for (var {} of ns);
    for (let {} of ns);
    for (const {} of ns);
    for (var [] of ns);
    for (let [] of ns);
    for (const [] of ns);
})();
