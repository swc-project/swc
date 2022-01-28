var test = ["a", "b", "c"];
for (let e in test) {
    console.log(e);
    let t;
    t = ["e", "f", "g"];
    for (let e in test) console.log(e);
}
