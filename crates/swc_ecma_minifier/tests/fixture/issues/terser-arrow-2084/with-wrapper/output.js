function run(obj) {
    with (obj){
        var c;
        console.log(1);
    }
    console.log(obj.c);
}
run({
    c: 10
});
