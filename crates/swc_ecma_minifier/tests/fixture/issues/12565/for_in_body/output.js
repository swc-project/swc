for(var k in {
    a: 1,
    b: 2
}){
    function g() {
        return k;
    }
}
console.log(typeof g, g());
