function includes() {
    let x = true;
    const search = new Proxy({}, {
        get (target, key, receiver) {
            if (key === Symbol.match) {
                x = false;
                return false;
            }
            return Reflect.get(target, key, receiver);
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f("".includes(search), 1) : f("".includes(search), 2);
}
function startsWith() {
    let x = true;
    const search = new Proxy({}, {
        get (target, key, receiver) {
            if (key === Symbol.match) {
                x = false;
                return false;
            }
            return Reflect.get(target, key, receiver);
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f("".startsWith(search), 1) : f("".startsWith(search), 2);
}
function endsWith() {
    let x = true;
    const search = new Proxy({}, {
        get (target, key, receiver) {
            if (key === Symbol.match) {
                x = false;
                return false;
            }
            return Reflect.get(target, key, receiver);
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f("".endsWith(search), 1) : f("".endsWith(search), 2);
}
console.log(includes(), startsWith(), endsWith());
