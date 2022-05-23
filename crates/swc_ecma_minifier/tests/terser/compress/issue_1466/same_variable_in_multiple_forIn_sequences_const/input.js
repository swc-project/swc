var test = ["a", "b", "c"];
for (const tmp in test) {
    console.log(tmp);
    let dd;
    dd = ["e", "f", "g"];
    for (const tmp in test) {
        console.log(tmp);
    }
}
