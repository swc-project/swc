for(var key in obj){
    var bar = obj[key];
    var qux = void 0;
    var fog = void 0;
    if (Array.isArray(bar)) {
        qux = bar[0];
        fog = bar[1];
    } else {
        qux = bar;
    }
    baz(key, qux, fog);
}
