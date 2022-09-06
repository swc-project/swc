var o = ["a", "b", "c"];
for (let l of o) {
    console.log(l);
    let o;
    o = ["e", "f", "g"];
    for (let l of o) {
        console.log(l);
    }
}
