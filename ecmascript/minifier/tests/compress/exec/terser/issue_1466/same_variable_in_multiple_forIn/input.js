var test = ["a", "b", "c"];
for (let tmp in test) {
    console.log(tmp);
    let dd;
    dd = ["e", "f", "g"];
    for (let tmp in test) {
        console.log(tmp);
    }
}
