let key = "first", events1 = [];
function parameterKey() {
    return events1.push(key), key;
}
function load() {
    return "default";
}
globalThis.service = {
    [(events1.push("method"), "read")]: ({ [parameterKey()]: callback = load } = {})=>callback
}, globalThis.changeKey = function() {
    key = "second";
}, globalThis.events = events1, console.log(events.join(","));
const first = service.read();
changeKey(), console.log(first === service.read({}), service.read({
    second: ()=>"provided"
})()), console.log(events.join(","));
