export function* progression() {
    var e = [];
    do {
        e.push((yield "pause"));
        continue;
    }while (false)
    return e.join("|") + "|tail";
}
export async function asyncProgression() {
    var e = [];
    do {
        e.push("before");
        e.push(await Promise.resolve("resumed"));
        break;
    }while (false)
    e.push("tail");
    return e.join("|");
}
var task = progression();
console.log(task.next().value);
console.log(task.next("resume").value);
console.log(await asyncProgression());
