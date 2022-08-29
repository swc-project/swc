//// [logicalAssignment4.ts]
function foo1(results) {
    (results || (results = [])).push(100);
}
function foo2(results) {
    (results ?? (results = [])).push(100);
}
function foo3(results) {
    results || (results = []);
    results.push(100);
}
function foo4(results) {
    results ?? (results = []);
    results.push(100);
}
function doSomethingWithAlias(thing, defaultValue) {
    if (v === 1) {
        if (thing && (thing = thing.original)) {
            thing.name;
        }
    } else if (v === 2) {
        if (thing && (thing = defaultValue)) {
            thing.name;
            defaultValue.name;
        }
    } else if (v === 3) {
        if (thing || (thing = defaultValue)) {
            thing.name;
            defaultValue.name;
        }
    } else {
        if (thing ?? (thing = defaultValue)) {
            thing.name;
            defaultValue.name;
        }
    }
}
