function withLog(t) {
    let e = {};
    for(let o in t){
        let n;
        e[o] = (n = o, function() {
            return console.log(n + ' invoked'), t[n].apply(this, arguments);
        });
    }
    return e;
}
function main() {
    withLog({
        test () {
            console.log('method test executed');
        },
        another () {
            console.log('method another executed');
        }
    }).test();
}
main();
