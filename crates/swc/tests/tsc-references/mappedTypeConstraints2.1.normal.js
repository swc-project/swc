//// [mappedTypeConstraints2.ts]
function f1(obj, key) {
    const x = obj[key];
}
function f2(obj, key) {
    const x = obj[key]; // Error
}
function f3(obj, key) {
    const x = obj[key]; // Error
}
function f4(obj, key) {
    let s = obj[key];
}
function f5(obj, key) {
    let s = obj[key];
}
function f6(obj, key) {
    let s = obj[key]; // Error
}
const get = (t, foo)=>foo[`get${t}`]; // Type 'Foo<T>[`get${T}`]' is not assignable to type 'T'
function validate(obj, bounds) {
    for (const [key, val] of Object.entries(obj)){
        const boundsForKey = bounds[key];
        if (boundsForKey) {
            const { min, max } = boundsForKey;
            if (min > val || max < val) return false;
        }
    }
    return true;
}
function genericTest(objectWithUnderscoredKeys, key) {
    const shouldBeTrue = objectWithUnderscoredKeys[`_${key}`]; // assignability fails here, but ideally should not
}
