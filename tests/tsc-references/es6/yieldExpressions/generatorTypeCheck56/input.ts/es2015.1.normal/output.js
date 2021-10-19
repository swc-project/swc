//@target: ES6
function* g() {
    var x = function() {
        var tmp = yield 0;
        class C {
            *[tmp]() {
                yield 0;
            }
        }
        return C;
    }();
}
