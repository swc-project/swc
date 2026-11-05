(function () {
    function load(value) { return value + 1; }
    let current;
    globalThis.service = {
        set options({ callback = load }) { current = callback; },
        get callback() { return current; }
    };
})();
service.options = {};
const first = service.callback;
service.options = {};
console.log(first === service.callback, service.callback(2));
service.options = { callback: null };
console.log(service.callback);
