(function () {
    let key = "first";
    const events = [];
    function methodKey() { events.push("method"); return "read"; }
    function parameterKey() { events.push(key); return key; }
    function load() { return "default"; }
    globalThis.service = {
        [methodKey()]({ [parameterKey()]: callback = load } = {}) {
            return callback;
        }
    };
    globalThis.changeKey = function () { key = "second"; };
    globalThis.events = events;
})();
console.log(events.join(","));
const first = service.read();
changeKey();
console.log(first === service.read({}), service.read({ second: () => "provided" })());
console.log(events.join(","));
