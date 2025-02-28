function withLog(e) {
    let t = {};
    for(let o in e){
        let n;
        t[o] = (n = o, function() {
            return console.log(n + ' invoked'), e[n].apply(this, arguments);
        });
    }
    return t;
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
