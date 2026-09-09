function declarations() {
    for (let x = 0; x < 1; x++) {
        for (let i = 0, read = () => i;;) break;
        eval("var leaked = 42");
    }
    return leaked;
}
console.log(declarations());

function captures() {
    var saved = [];
    for (let x = 0; x < 2; x++) {
        for (let i = 0, read = () => i;;) break;
        eval("var leaked = x");
        saved.push(eval("() => x"));
    }
    return [leaked, saved.map(f => f())];
}
console.log(JSON.stringify(captures()));

function completions() {
    var saved = [], count = 0;
    outer: for (let x = 0, y = 10; x < 4; x++) {
        for (let i = 0, read = () => i;;) break;
        saved.push(eval("() => [x, y]"));
        eval("var leaked = x; y++; x++");
        count++;
        if (x === 1) continue outer;
        break outer;
    }
    return [leaked, count, saved.map(f => f())];
}
console.log(JSON.stringify(completions()));

function varHeader() {
    for (var x = 0; x < 1; x++) {
        for (let i = 0, read = () => i;;) break;
        eval("var leaked = 42");
    }
    return leaked;
}
console.log(varHeader());

function finalizers() {
    var saved = [];
    for (let x = 0; x < 4; x++) {
        for (let i = 0, read = () => i;;) break;
        saved.push(eval("() => x"));
        try {
            eval("var leaked = x");
            continue;
        } finally {
            x++;
        }
    }
    return [leaked, saved.map(f => f())];
}
console.log(JSON.stringify(finalizers()));

function abrupt() {
    var saved;
    try {
        for (let x = 0; x < 1; x++) {
            for (let i = 0, read = () => i;;) break;
            saved = eval("() => x");
            try {
                eval("var leaked = 7");
                throw "stop";
            } finally {
                x = 9;
            }
        }
    } catch (error) {
        return [error, leaked, saved()];
    }
}
console.log(JSON.stringify(abrupt()));

function returning() {
    for (let x = 0; x < 1; x++) {
        for (let i = 0, read = () => i;;) break;
        var saved = eval("() => x");
        try {
            return saved;
        } finally {
            x = 8;
        }
    }
}
console.log(returning()());

function enumerating() {
    var saved = [];
    for (let key in {a: 1, b: 2}) {
        for (let i = 0, read = () => i;;) break;
        eval("var leaked = key");
        saved.push(eval("() => key"));
    }
    return [leaked, saved.map(f => f())];
}
console.log(JSON.stringify(enumerating()));

function bodyEvalLocals() {
    var saved = [];
    for (let x = 0; x < 2; x++) {
        let local = x;
        for (let i = 0, read = () => i;;) break;
        eval("var leaked = local");
        saved.push(eval("() => local"));
    }
    return [leaked, saved.map(f => f())];
}
console.log(JSON.stringify(bodyEvalLocals()));

function nestedLocals() {
    var saved = [];
    for (let x = 0; x < 2; x++) {
        for (let i = 0, read = () => i;;) break;
        for (var n = 0; n < 1; n++) {
            let local = x;
            saved.push(eval("() => local"));
            eval("var leaked = x");
        }
    }
    return [leaked, saved.map(f => f())];
}
console.log(JSON.stringify(nestedLocals()));

function nestedHeaders() {
    var saved = [];
    for (let x = 0; x < 2; x++) {
        for (let i = 0, read = () => i;;) break;
        for (var n = 0; n < 1; n++) {
            for (let local = x;;) {
                saved.push(eval("() => local"));
                eval("var leaked = x");
                break;
            }
        }
    }
    return [leaked, saved.map(f => f())];
}
console.log(JSON.stringify(nestedHeaders()));

function helperHeaders() {
    var saved = [];
    for (let x = 0; x < 2; x++) {
        for (let i = 0, read = () => i;;) break;
        for (let j = x; (saved.push(eval("() => j")), true);) {
            (() => j)();
            break;
        }
    }
    return saved.map(f => f());
}
console.log(JSON.stringify(helperHeaders()));
