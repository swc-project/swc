function run() {
    let x = true;
    const key = new Proxy({}, {
        get (_, property) {
            if (property === Symbol.toPrimitive) {
                x = false;
                return ()=>"key";
            }
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f({}[key], 1) : f({}[key], 2);
}
function objectProperty() {
    let x = true;
    const key = new Proxy({}, {
        get (_, property) {
            if (property === Symbol.toPrimitive) {
                x = false;
                return ()=>"key";
            }
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f({
        [key]: 0
    }, 1) : f({
        [key]: 0
    }, 2);
}
function looseComparison() {
    let x = true;
    const key = new Proxy({}, {
        get (_, property) {
            if (property === Symbol.toPrimitive) {
                x = false;
                return ()=>0;
            }
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f(0 == key, 1) : f(0 == key, 2);
}
console.log(run(), objectProperty(), looseComparison());
