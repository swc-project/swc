function dist_index_es_P(e) {
    try {
        t = JSON.stringify(e);
    } catch (r) {
        t = String(e);
    }
    for (var r = 0, o = 0; o < t.length; o++) {
        r += 1;
    }
    console.log(r);
    return r;
}

dist_index_es_P("aa");
