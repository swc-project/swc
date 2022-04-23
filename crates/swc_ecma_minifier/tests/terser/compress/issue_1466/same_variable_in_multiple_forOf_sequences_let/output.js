var test = ["a", "b", "c"];
for (let o of test) {
    let e;
    console.log(o), (e = ["e", "f", "g"]);
    for (let o of e) console.log(o);
}
