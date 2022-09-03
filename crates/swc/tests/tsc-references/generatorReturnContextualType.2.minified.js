//// [generatorReturnContextualType.ts]
function* f1() {
    return {
        x: 'x'
    };
}
function* g1() {
    return {
        x: 'x'
    };
}
async function* f2() {
    return {
        x: 'x'
    };
}
async function* g2() {
    return {
        x: 'x'
    };
}
async function* f3() {
    return Promise.resolve({
        x: 'x'
    });
}
async function* g3() {
    return Promise.resolve({
        x: 'x'
    });
}
async function* f4() {
    return Promise.resolve({
        x: 'x'
    });
}
async function* g4() {
    return Promise.resolve({
        x: 'x'
    });
}
