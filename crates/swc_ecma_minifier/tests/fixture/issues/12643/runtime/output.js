let transform, delayed;
globalThis.process = (value)=>transform ? transform(value) : value, globalThis.install = (next)=>{
    transform = next;
}, console.log(globalThis.process("before")), globalThis.install((value)=>value.toUpperCase()), console.log(globalThis.process("after")), globalThis.parameter = function(value) {
    var value;
    return ()=>value || "FAIL";
}, console.log(globalThis.parameter("parameter")()), globalThis.argument = function() {
    var arguments;
    return ()=>arguments ? arguments[0] : "FAIL";
}, console.log(globalThis.argument("argument")());
try {
    throw "caught";
} catch (value) {
    var value;
    globalThis.caught = ()=>value || "FAIL";
}
console.log(globalThis.caught());
const values = [];
for (let value of [
    "first",
    "second"
])values.push(()=>value || "FAIL");
for(var key in {
    third: 1
})values.push(()=>key || "FAIL");
console.log(values.map((read)=>read()).join(",")), globalThis.read = ()=>delayed || void 0, console.log(globalThis.read()), delayed = "assigned", console.log(globalThis.read());
