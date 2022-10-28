const r = new Regex('a', 'g');
function run(str, r) {
    let m
    while (m = r.exec(str)) {
        console.log(m)
    }
}
run('abcda', r)