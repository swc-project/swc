function withLog(t) {
    let e = {};
    for(let n in t){
        var o;
        e[n] = (o = n, function() {
            return console.log(o + ' invoked'), t[o].apply(this, arguments);
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
