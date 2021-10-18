// @strict: true
// @target: esnext, es2020, es2015
// @allowUnreachableCode: false
function foo1(results) {
    (results || (results = [])).push(100);
}
function foo2(results) {
    (results !== null && results !== void 0 ? results : results = []).push(100);
}
function foo3(results) {
    results || (results = []);
    results.push(100);
}
function foo4(results) {
    results !== null && results !== void 0 ? results : results = [];
    results.push(100);
}
function doSomethingWithAlias(thing, defaultValue) {
    if (v === 1) {
        if (thing &&= thing.original) {
            thing.name;
        }
    } else if (v === 2) {
        if (thing &&= defaultValue) {
            thing.name;
            defaultValue.name;
        }
    } else if (v === 3) {
        if (thing || (thing = defaultValue)) {
            thing.name;
            defaultValue.name;
        }
    } else {
        if (thing !== null && thing !== void 0 ? thing : thing = defaultValue) {
            thing.name;
            defaultValue.name;
        }
    }
}
