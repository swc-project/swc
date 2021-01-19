var test = ["a", "b", "c"];
for (const o of test) {
    let t;
    console.log(o), (t = ["e", "f", "g"]);
    for (const o of t) console.log(o);
}
