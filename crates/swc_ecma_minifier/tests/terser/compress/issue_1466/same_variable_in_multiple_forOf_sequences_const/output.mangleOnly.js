var o = ["a", "b", "c"];
for (const c of o) {
    console.log(c);
    let o;
    o = ["e", "f", "g"];
    for (const c of o) {
        console.log(c);
    }
}
