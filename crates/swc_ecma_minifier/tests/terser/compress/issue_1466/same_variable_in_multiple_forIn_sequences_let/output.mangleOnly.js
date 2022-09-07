var o = ["a", "b", "c"];
for (let l in o) {
    console.log(l);
    let e;
    e = ["e", "f", "g"];
    for (let l in o) {
        console.log(l);
    }
}
