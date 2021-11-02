foo("", function*() {
    yield (x)=>x.length
    ;
}, (p)=>void 0
); // T is fixed, should be string
