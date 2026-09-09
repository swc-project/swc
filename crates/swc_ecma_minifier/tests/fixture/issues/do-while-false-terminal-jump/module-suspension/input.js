export function* progression() {
    var steps = [];
    do {
        steps.push(yield "pause");
        continue;
    } while (false);
    return steps.join("|") + "|tail";
}

export async function asyncProgression() {
    var steps = [];
    do {
        steps.push("before");
        steps.push(await Promise.resolve("resumed"));
        break;
    } while (false);
    steps.push("tail");
    return steps.join("|");
}

var task = progression();
console.log(task.next().value);
console.log(task.next("resume").value);
console.log(await asyncProgression());
