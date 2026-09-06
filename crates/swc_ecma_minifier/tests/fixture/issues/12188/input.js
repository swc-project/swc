function member(a, b) {
    let index = 0;
    a[index++] = (console.log("member test", index), b) ? 1 : 2;
    console.log("member result", index, a[0]);
}

function destructuring(a, b) {
    let index = 0;
    [a[index++]] = (console.log("destructuring test", index), b) ? [1] : [2];
    console.log("destructuring result", index, a[0]);
}

var identifierResult;

function identifier(b) {
    identifierResult = (console.log("identifier test"), b) ? 1 : 2;
    console.log("identifier result", identifierResult);
}

member([], true);
destructuring([], true);
identifier(true);
