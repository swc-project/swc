function lower() {
    let x = true;
    let locales = new Proxy([
        "en"
    ], {
        get (target, key, receiver) {
            x = false;
            return Reflect.get(target, key, receiver);
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f("A".toLocaleLowerCase(locales), 1) : f("A".toLocaleLowerCase(locales), 2);
}
function upper() {
    let x = true;
    let locales = new Proxy([
        "en"
    ], {
        get (target, key, receiver) {
            x = false;
            return Reflect.get(target, key, receiver);
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f("a".toLocaleUpperCase(locales), 1) : f("a".toLocaleUpperCase(locales), 2);
}
function compare() {
    let x = true;
    let locales = new Proxy([
        "en"
    ], {
        get (target, key, receiver) {
            x = false;
            return Reflect.get(target, key, receiver);
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f("a".localeCompare("b", locales), 1) : f("a".localeCompare("b", locales), 2);
}
console.log(lower(), upper(), compare());
