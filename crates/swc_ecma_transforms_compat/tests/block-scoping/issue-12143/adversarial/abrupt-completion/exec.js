var events = [];
function* run() {
    try {
        for (let i = 1, read = () => i, next = yield read();;) {
            events.push("body");
            break;
        }
    } finally {
        events.push("finally");
    }
}
var iterator = run();
console.log(JSON.stringify(iterator.next()));
console.log(JSON.stringify(iterator.return(9)), events.join());

var read;
try {
    for (let i = 3, save = (read = () => i), stop = (() => { throw "initializer"; })();;) {
        console.log("unreachable");
    }
} catch (error) {
    console.log(error, read());
}
