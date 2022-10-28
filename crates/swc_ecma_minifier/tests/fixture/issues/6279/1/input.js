function run(str, r) {
    let m
    while (m = r.exec(str)) {
        console.log(m)
    }
}
run('abcda', /a/g)