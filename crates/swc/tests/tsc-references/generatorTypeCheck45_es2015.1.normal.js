foo("", function*() {
    yield (x)=>x.length;
}, (p)=>undefined); // T is fixed, should be string
