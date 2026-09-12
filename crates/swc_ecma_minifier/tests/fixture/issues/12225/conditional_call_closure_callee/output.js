function run() {
    let f = (x)=>"before";
    function test() {
        f = (x)=>"after";
        return true;
    }
    return test() ? f(1) : f(2);
}
console.log(run());
