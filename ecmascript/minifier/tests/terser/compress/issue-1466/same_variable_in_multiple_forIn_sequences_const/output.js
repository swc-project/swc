var test = ["a", "b", "c"];
for (const o in test) {
    let t;
    console.log(o), (t = ["e", "f", "g"]);
    for (const o in test) console.log(o);
}
