function expectA(a) {
    console.log(a.b === 1);
}
export function test() {
    var _loop = function(i) {
        var a = {
            get b () {
                return 1;
            }
        };
        var c = 2;
        (function() {
            c;
        });
        expectA(a);
    };
    for(var i = 0; i < 1; i++)_loop(i);
}
